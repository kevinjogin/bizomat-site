import type { Guide } from '../types.ts';

// Procurement (ERP Release 1's supplier master and Release 2's purchasing). Labels are the client's own words:
// apps/work/src/client/system/erp/Suppliers.tsx and Purchasing.tsx; rules from apps/work/src/worker/erp/access.ts,
// suppliers.ts, procurement.ts and purchasing.ts.
const guide: Guide = {
  id: 'procurement',
  section: 'modules',
  title: 'Procurement',
  status: 'live',
  what:
    'Procurement is where the company buys: approved suppliers, purchase requisitions, requests for quotation with a side-by-side comparison, purchase orders with an approval limit, and goods receipts that bring stock in. Each receipt can make one draft supplier bill in Finance and Accounting.',
  purpose: [
    'Keep approved suppliers with their contacts, terms, documents and performance.',
    'Ask for goods with a requisition that a procurement manager approves.',
    'Ask suppliers for prices and compare their quotations.',
    'Order with purchase orders that are approved within limits, with every amendment kept.',
    'Receive goods into stock with lots, serial numbers and expiry dates.',
    'Make the supplier’s draft bill in Finance from what was accepted.',
  ],
  who: [
    'Buyers, who keep suppliers, ask for quotations and make purchase orders.',
    'Procurement managers, who approve suppliers, requisitions, supplier choices and orders above the limit.',
    'Warehouse managers and operators, who receive the goods.',
    'Engineers and production staff, who raise requisitions for what they need.',
    'Executives and viewers, who read without changing anything.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Procurement'],
    href: 'https://bizomat.ai/erp/procurement',
    label: 'Open Procurement',
    note: 'Choose Procurement in the module rail: it opens in the company you used last. Its side menu lists Suppliers, Requisitions, Quotations, Purchase orders and Receipts.',
  },
  tutorials: [
    {
      id: 'add-a-supplier',
      title: 'Add and approve a supplier',
      outcome: 'The supplier is approved, linked to the Finance supplier it is paid as, and can be sent requests and orders.',
      needs: 'Buyer, procurement manager or ERP administrator to add. A procurement manager who did not add it approves it.',
      steps: [
        {
          title: 'Choose New supplier',
          body: 'Open Procurement. The Suppliers tab lists suppliers with their status. Choose New supplier.',
          where: 'New supplier',
        },
        {
          title: 'Fill in the supplier',
          body: 'Give the Legal name (required), Trading name, ABN, Category, Email, Phone, Website, Postal address, Delivery address, Payment terms (days), Currency, Usual lead time (days), Delivery terms and Notes. The ABN is checked for its form and check digits only and shows as Format checked; it is not looked up on the Australian Business Register.',
        },
        {
          title: 'Choose Add the supplier',
          body: 'The supplier is numbered and starts as Pending approval. Add people with Add a contact, and mark one Primary contact. Add their documents in the Documents section.',
          where: 'Add the supplier',
        },
        {
          title: 'Link it to Finance',
          body: 'In the Finance section, choose Link an existing Finance supplier, or Create it in Finance and link. Linking needs a Finance role that can see contacts, and creating one needs a Finance role that can add them; without a Finance role you cannot do either. Nothing is copied: bills and payments stay in Finance and Accounting.',
          where: 'Create it in Finance and link',
        },
        {
          title: 'Approve it',
          body: 'A procurement manager who did not create the supplier chooses Approve. Put on hold and Block need a reason. Changing an approved supplier’s legal name or ABN sends it back to Pending approval.',
          where: 'Approve',
        },
      ],
      after: 'Only approved suppliers can be sent requests for quotation and purchase orders.',
    },
    {
      id: 'raise-a-requisition',
      title: 'Raise and approve a requisition',
      outcome: 'An approved requisition is ready for quotations or a purchase order.',
      needs: 'Engineers, engineering approvers, buyers, procurement managers, warehouse and production staff and ERP administrators raise requisitions. A procurement manager who did not raise it approves it.',
      steps: [
        {
          title: 'Choose New requisition',
          body: 'Open the Requisitions tab and choose New requisition.',
          where: 'New requisition',
        },
        {
          title: 'Say what you need',
          body: 'Give a Title, the Department, Required by, a Budget reference and the Reason. Add lines: a product, or a free-text item, with quantity, unit, specification and estimated cost.',
        },
        {
          title: 'Submit it',
          body: 'Choose Save draft to finish later, or Submit for approval. It is numbered and shows as Submitted.',
          where: 'Submit for approval',
        },
        {
          title: 'Approve or reject it',
          body: 'A procurement manager opens it and chooses Approve (a note is optional) or Reject (a reason is required). The dashboard’s Procurement card counts requisitions waiting to be approved.',
          where: 'Approve',
        },
        {
          title: 'Buy what it asks for',
          body: 'On the approved requisition a buyer chooses Request quotations, or skips them with Make a purchase order from it, which drafts an order at the requisition’s estimates for the supplier chosen.',
          where: 'Request quotations',
        },
      ],
    },
    {
      id: 'compare-quotations',
      title: 'Ask for quotations and choose a supplier',
      outcome: 'A supplier’s quotation is selected with a reason, the choice is approved, and the purchase order is drafted from it.',
      needs: 'Buyer, procurement manager or ERP administrator. A procurement manager who did not select the supplier approves the choice.',
      steps: [
        {
          title: 'Make the request for quotation',
          body: 'On an approved requisition choose Request quotations, or on the Quotations tab choose New request. Give the Reply by and Goods needed by dates, tick the suppliers to ask under Suppliers (approved only), then choose Create.',
          where: 'Request quotations',
        },
        {
          title: 'Send each supplier its PDF',
          body: 'In the Suppliers section, download each supplier’s PDF: it lists the items with empty columns for their price and lead time. Send it from your own email, then choose Record as sent. BIZOMAT does not email it for you yet.',
          where: 'Record as sent',
        },
        {
          title: 'Record each quotation',
          body: 'When a supplier answers, choose Record quotation and type the unit prices per line, the lead time, freight, payment terms, validity and notes. Choose Save, then attach the supplier’s own document.',
          where: 'Record quotation',
        },
        {
          title: 'Read the comparison',
          body: 'The Comparison section shows the quotations side by side, line by line, and marks the Cheapest and the Fastest among complete, valid quotations. Export CSV downloads it.',
          where: 'Comparison',
        },
        {
          title: 'Choose Select a supplier',
          body: 'Choose the quotation and write Why this supplier. The request shows as Supplier selected.',
          where: 'Select a supplier',
        },
        {
          title: 'Approve the choice',
          body: 'A procurement manager who did not select it chooses Approve the choice, or Return the choice to send it back.',
          where: 'Approve the choice',
        },
        {
          title: 'Choose Make the purchase order',
          body: 'A draft purchase order opens with the quotation’s prices, its freight as a line, and its terms.',
          where: 'Make the purchase order',
        },
      ],
    },
    {
      id: 'make-a-purchase-order',
      title: 'Make, approve and send a purchase order',
      outcome: 'An approved purchase order has been sent to the supplier and recorded as sent.',
      needs: 'Buyer, procurement manager or ERP administrator makes and submits it. Above the approval limit, a procurement manager who did not submit it approves it.',
      steps: [
        {
          title: 'Start the order',
          body: 'On the Purchase orders tab choose New purchase order, or start from an approved quotation choice or requisition.',
          where: 'New purchase order',
        },
        {
          title: 'Fill in the order',
          body: 'Choose an approved supplier, then Required by, Payment terms (days), Currency, Prices (Before GST, Including GST or No GST) and Deliver to. Add lines with a product or free-text item, quantity, unit price, discount and tax code; the tax codes come from the company’s Finance workspace when it has one. The PDF is drawn beside the form as you type.',
        },
        {
          title: 'Choose Save draft, then Submit',
          body: 'Within the company’s approval limit the order is approved at once. Above it, in another currency, or when no limit is set, it waits as Awaiting approval. The rule used shows as a badge on the order.',
          where: 'Submit',
        },
        {
          title: 'Approve it',
          body: 'A procurement manager chooses Approve, or Return to draft with a reason. The dashboard’s Procurement card counts purchase orders to approve.',
          where: 'Approve',
        },
        {
          title: 'Send it and record it',
          body: 'Choose View PDF or Download. A draft or awaiting-approval order prints DRAFT. Send the PDF from your own email, then choose Record as sent.',
          where: 'Record as sent',
        },
        {
          title: 'Amend it if something changes',
          body: 'On an approved, sent or partly received order choose Amend and give the reason. The version before is kept under Earlier versions, the revision number goes up, and the order goes back to draft and through approval again. A line cannot drop below what was received.',
          where: 'Amend',
        },
      ],
      after: 'The warehouse receives the goods against the order. Close ends an order with something still outstanding; Cancel stops one that has received nothing.',
    },
    {
      id: 'receive-goods',
      title: 'Receive goods and make the draft bill',
      outcome: 'The goods are in stock, the receipt is numbered, and one draft supplier bill is waiting in Finance.',
      needs: 'Warehouse manager, warehouse operator or ERP administrator receives. The draft bill is made by a buyer, procurement manager or ERP administrator whose Finance role may create bills.',
      steps: [
        {
          title: 'Choose Receive goods',
          body: 'Open the purchase order (Approved, Sent or Partly received) and choose Receive goods. On a phone, the warehouse screen’s Receive does the same one line at a time.',
          where: 'Receive goods',
        },
        {
          title: 'Record what arrived',
          body: 'For each line give the quantity received, any damaged or rejected quantity with its reason, where it goes (else the product’s usual location), and the lot, serial numbers (one per unit) and expiry date when the product tracks them. Add the Received date, Delivery reference and Notes, then choose Receive.',
          where: 'Receive',
        },
        {
          title: 'Check the receipt',
          body: 'Accepted means received less damaged and rejected. Accepted goods enter stock in the same step. Lines of products that need inspection show Inspect, and Start inspection opens it in Quality for an inspector.',
          where: 'Inspection required',
        },
        {
          title: 'Choose Make a draft bill in Finance',
          body: 'On the receipt, the bill is made from what was accepted, at the order’s prices, discounts and tax codes, for the supplier’s linked Finance supplier. It is made once: asking again opens the same bill. Choose Open the draft bill to see it.',
          where: 'Make a draft bill in Finance',
        },
        {
          title: 'Approve and record the payment in Finance',
          body: 'In Finance and Accounting, Bills, someone whose Finance role may approve bills checks it against the supplier’s invoice and chooses Approve. When you have paid the supplier through your bank, choose Record a payment. BIZOMAT does not make the payment.',
          where: 'Record a payment',
        },
      ],
      after: 'Supplier performance (on time, in full, lead time) is measured from receipts and shows on the supplier’s page.',
    },
  ],
  buttons: [
    { label: 'New supplier', does: 'Adds a supplier, pending approval.', when: 'Before you ask a new supplier for prices or order from it.' },
    { label: 'Approve', does: 'On a supplier, a requisition or a purchase order awaiting approval: approves it. On a supplier, Put on hold and Block stop its use, with a reason.', when: 'Procurement managers only, never for something they created, raised or submitted.' },
    { label: 'New requisition', does: 'Asks for goods, with lines, a date, a department, a budget reference and a reason.', when: 'Whenever someone needs something bought.', after: 'Submit for approval sends it to a procurement manager.' },
    { label: 'Request quotations', does: 'Makes a request for quotation to approved suppliers from an approved requisition.', when: 'When you want prices before you order.' },
    { label: 'Record as sent', does: 'Records that you sent the PDF from your own email.', when: 'After you download and send a request for quotation or a purchase order.' },
    { label: 'Record quotation', does: 'Records a supplier’s prices, lead time, freight, terms and validity.', when: 'When the supplier answers.', after: 'The comparison updates.' },
    { label: 'Select a supplier', does: 'Chooses one quotation, with a reason.', when: 'Once the quotations are in.', after: 'A procurement manager who did not select it approves the choice.' },
    { label: 'Make the purchase order', does: 'Drafts the purchase order from the approved quotation.', when: 'After the choice is approved.' },
    { label: 'Submit', does: 'Sends a draft purchase order for approval; within the limit it is approved at once.', when: 'When the order is complete.' },
    { label: 'Amend', does: 'Reopens an approved, sent or partly received order to change it, keeping the version before.', when: 'When quantities, prices or dates change after approval.', after: 'It goes back through approval.' },
    { label: 'Receive goods', does: 'Records a goods receipt against the order and brings accepted goods into stock.', when: 'When a delivery arrives. Warehouse roles only.' },
    { label: 'Make a draft bill in Finance', does: 'Makes one draft supplier bill in Finance from the receipt.', when: 'After the receipt, by someone whose Finance role may create bills.', after: 'The bill is approved and its payment recorded in Finance.' },
  ],
  faqs: [
    {
      q: 'Why can I not approve my own requisition, supplier choice or purchase order?',
      a: 'Nobody approves what they raised, selected or submitted (segregation of duties): another procurement manager must. In a company of one person the approval goes through and is recorded as an exception on the record and in its history (see /learn/roles-and-permissions/).',
    },
    {
      q: 'Why is my purchase order Awaiting approval?',
      a: 'Its total is above the company’s purchase order approval limit, it is in another currency than the company’s stock currency, or no limit is set (then a procurement manager approves every order). An ERP administrator sets the limit in Administration, Purchasing, inventory and manufacturing settings.',
    },
    {
      q: 'Can BIZOMAT email the purchase order to the supplier?',
      a: 'Not yet. Email with the PDF attached is not available: download the PDF, send it from your own email, then choose Record as sent. Requests for quotation work the same way.',
    },
    {
      q: 'Why can I not choose this supplier on a request or order?',
      a: 'Only approved suppliers can be used. Pending, on hold, blocked and archived suppliers are refused. An approved supplier whose legal name or ABN changes goes back to pending until it is approved again.',
    },
    {
      q: 'Why can a buyer not receive the goods?',
      a: 'The buyer orders and the warehouse receives: receiving needs the Warehouse manager or Warehouse operator ERP role (or ERP administrator), and a warehouse operator cannot order.',
    },
    {
      q: 'Why is Make a draft bill in Finance missing?',
      a: 'The receipt’s Finance section says why: the company does not run a Finance business workspace; the supplier is not linked to its Finance supplier yet (link it on the supplier’s page); you have no access to the company’s Finance workspace; your Finance role cannot create bills; or you are not a buyer, procurement manager or ERP administrator. Once the bill is made, the button becomes Open the draft bill.',
    },
    {
      q: 'Does approving the bill pay the supplier?',
      a: 'No. BIZOMAT does not connect to banks or make payments. Pay the supplier through your bank, then record the payment on the bill in Finance and Accounting (see /learn/finance/).',
    },
    {
      q: 'Is the supplier’s ABN looked up on the Australian Business Register?',
      a: 'No. It is checked for its form and check digits only, and shows as Format checked. A number with the right form may still belong to someone else, so check it yourself where it matters.',
    },
    {
      q: 'Is the value of the goods received posted to Finance’s ledger?',
      a: 'No. Stock value is kept in the ERP. Each movement records the posting it would need as planned, and nothing is posted. The draft bill is made in Finance through Finance itself.',
    },
  ],
  related: ['inventory', 'finance', 'products', 'quality', 'manufacturing', 'reports', 'roles-and-permissions'],
  chain: ['procurement', 'inventory', 'finance'],
  workflows: ['procure-to-pay', 'bom-to-production'],
  notYet: [
    { text: 'Emailing purchase orders and requests for quotation with the PDF attached (today: download, send from your own email, record as sent).', status: 'planned' },
    { text: 'Three-way matching against the supplier’s own invoice (receipts and their draft bills are linked today).', status: 'planned' },
    { text: 'Supplier qualification, supplier contracts and purchase scheduling.', status: 'planned' },
    { text: 'Posting the value of goods received to Finance’s ledger (recorded as planned; nothing is posted).', status: 'planned' },
  ],
  keywords: [
    'PO', 'purchase order', 'purchasing', 'buying', 'vendor', 'supplier', 'supplier invoice', 'bill', 'accounts payable',
    'requisition', 'purchase request', 'RFQ', 'request for quotation', 'quote', 'tender', 'goods receipt', 'GRN',
    'receiving', 'approval limit', 'ABN', 'supplier performance', 'on time in full',
  ],
  sources: [
    'apps/work/src/client/system/erp/Suppliers.tsx',
    'apps/work/src/client/system/erp/Purchasing.tsx',
    'apps/work/src/client/system/erp/WarehouseScreen.tsx',
    'apps/work/src/client/system/erp/ErpSettings.tsx',
    'apps/work/src/client/system/erp/api.ts',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/client/fin/Docs.tsx',
    'apps/work/src/client/fin/FinApp.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/suppliers.ts',
    'apps/work/src/worker/erp/procurement.ts',
    'apps/work/src/worker/erp/purchasing.ts',
    'docs/erp/release-1.md',
    'docs/erp/release-2.md',
    'docs/erp/STATUS.md',
    'docs/finance/README.md',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
