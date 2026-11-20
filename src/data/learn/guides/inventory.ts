import type { Guide } from '../types.ts';

// Inventory (ERP Release 2). Labels are the client's own words: apps/work/src/client/system/erp/Inventory.tsx,
// WarehouseScreen.tsx and ErpSettings.tsx; rules from apps/work/src/worker/erp/access.ts, stock.ts and inventory.ts.
const guide: Guide = {
  id: 'inventory',
  section: 'modules',
  title: 'Warehouse: Stock',
  status: 'live',
  what:
    'Inventory shows what stock the company holds, where it is and every movement of it. Warehouses hold a tree of locations, stock is kept by product, location, lot and serial number, and every change is a line in a movement ledger that is never changed or deleted.',
  purpose: [
    'See on hand, reserved, available, in quarantine and on order for each product.',
    'Set up warehouses and locations, and print their QR labels.',
    'Issue, move, reserve, quarantine, return and scrap stock.',
    'Correct stock with adjustments, and check it with stocktakes and cycle counts.',
    'Value stock by weighted average or first in, first out.',
    'Trace a lot or serial number from its supplier to where it went.',
  ],
  who: [
    'Warehouse managers, who set up warehouses and approve adjustments and counts.',
    'Warehouse operators, who receive, issue, move, reserve and count stock.',
    'Buyers and production staff, who check what is available.',
    'Quality staff, who work with stock in quarantine.',
    'Executives and viewers, who read stock and its value.',
  ],
  access: {
    path: ['BIZOMAT ERP', 'Warehouse', 'Stock'],
    href: 'https://bizomat.ai/erp/inventory',
    label: 'Open Inventory',
    note: 'Choose Warehouse in the module rail, then Stock in its side menu. Under Stock the side menu lists Stock, Warehouses, Movements, Adjustments, Counts, Valuation and Warehouse screen.',
  },
  tutorials: [
    {
      id: 'set-up-a-warehouse',
      title: 'Set up a warehouse and its locations',
      outcome: 'A warehouse with a tree of locations and printed QR labels, and products set up to be tracked the way you need.',
      needs: 'Warehouse manager or ERP administrator. The costing method is an ERP administrator’s setting.',
      steps: [
        {
          title: 'Choose the costing method first',
          body: 'An ERP administrator opens Administration, Purchasing, inventory and manufacturing settings, and chooses the Costing method (weighted average or first in, first out) and the Stock currency. Both lock at the first stock movement; if nothing was chosen, the first movement locks weighted average.',
          where: 'Costing method',
        },
        {
          title: 'Choose New warehouse',
          body: 'Open the Warehouses tab and choose New warehouse. Give a Code, a Name and the Address, then choose Create.',
          where: 'New warehouse',
        },
        {
          title: 'Add its locations',
          body: 'Open the warehouse and choose Add a location. Give a Code, a Name, the Level (Store, Zone, Rack, Shelf or Bin) and the Kind (Normal, Quarantine, Work in progress, Finished goods, Receiving or Dispatch). Choose Add. Use Inside on a location to add one within it, so stores hold zones, racks, shelves and bins.',
          where: 'Add a location',
        },
        {
          title: 'Print the QR labels',
          body: 'Choose Print QR labels, then Print. BIZOMAT makes the codes itself. A location’s label reads LOC: followed by the warehouse and location codes.',
          where: 'Print QR labels',
        },
        {
          title: 'Set each product’s stock settings',
          body: 'On the Stock tab open a product, then choose Stock settings. Tick Lot numbers, Serial numbers (one unit each), Expiry dates and Inspection required on receipt as needed (tracking changes only while there is no stock). Give a Reorder point, Minimum, Maximum and the Usual location, where receipts go unless another is chosen. Choose Save.',
          where: 'Stock settings',
        },
      ],
      after: 'Goods come in from purchase order receipts (see /learn/procurement/), returns and adjustments.',
    },
    {
      id: 'move-stock',
      title: 'Issue, move, reserve or quarantine stock',
      outcome: 'The stock is where it should be, and the movement is in the ledger with its reference.',
      needs: 'Warehouse manager, warehouse operator or ERP administrator.',
      steps: [
        {
          title: 'Find the product',
          body: 'On the Stock tab, view By product, or By location, lot and serial. Filter by warehouse, and open the product.',
          where: 'By product',
        },
        {
          title: 'Read its stock page',
          body: 'The page shows On hand, Reserved, Available, In quarantine, On order and Value, then Where it is: each location, lot, serial and expiry date. Stock in quarantine is never available.',
          where: 'Where it is',
        },
        {
          title: 'Choose Act… on a row',
          body: 'Choose Issue, Move, Reserve, Quarantine, Return to supplier or Scrap. In a quarantine location the choices are Release from quarantine, Scrap and Return to supplier.',
          where: 'Act…',
        },
        {
          title: 'Give the quantity and confirm',
          body: 'Give the quantity, the location it goes To for a move, and a reference or reason. Confirm with the button named after the action. Scrap worth more than the company’s approval threshold needs a warehouse manager.',
        },
        {
          title: 'Use or free a reservation',
          body: 'Under Reservations, choose Issue it to issue reserved stock, or Release to free it. A reservation that belongs to a sales order is released from the sales order instead.',
          where: 'Reservations',
        },
        {
          title: 'Take back goods from a customer',
          body: 'Choose Customer return on the product’s stock page and choose the location they go into. Returns against a sales order are received in Supply Chain.',
          where: 'Customer return',
        },
      ],
    },
    {
      id: 'adjust-and-count',
      title: 'Adjust stock and run a count',
      outcome: 'Stock matches what is on the shelves, and every correction is a movement with its reason and approval.',
      needs: 'A warehouse manager or operator asks for an adjustment and counts. A warehouse manager who did not ask or count approves.',
      steps: [
        {
          title: 'Choose New adjustment',
          body: 'On the Adjustments tab choose New adjustment (or Adjust stock on the Stock tab). Choose the Product, the Location, the Change (Less stock or More stock), the Quantity, the lot, serial and expiry when tracked, the Unit cost for added stock and the Reason. Choose Save.',
          where: 'New adjustment',
        },
        {
          title: 'Approve it if it waits',
          body: 'An adjustment worth more than the company’s threshold, or any adjustment when no threshold is set, waits for approval. A warehouse manager who did not ask for it chooses Approve or Reject.',
          where: 'Approve',
        },
        {
          title: 'Choose New count',
          body: 'On the Counts tab choose New count. Choose the Kind (Stocktake or Cycle count) and the Warehouse. To count one place, choose it under Only this location (and what is inside it); else the whole warehouse is counted. Choose Open the count.',
          where: 'Open the count',
        },
        {
          title: 'Enter the counts',
          body: 'The Count sheet lists every stock record there with its quantity when the count was opened. Type what you find and choose Save counts, on a computer or with the warehouse screen’s Count on a phone. Count when nothing is moving: lines where stock moved since opening are marked.',
          where: 'Save counts',
        },
        {
          title: 'Submit and approve',
          body: 'Choose Submit when every line is counted. A warehouse manager who did not submit it chooses Approve and post: each variance posts as a stock movement, once.',
          where: 'Approve and post',
        },
      ],
    },
    {
      id: 'warehouse-screen',
      title: 'Use the warehouse screen on a phone',
      outcome: 'You received, issued, moved or counted stock by scanning or typing codes.',
      needs: 'Warehouse manager, warehouse operator or ERP administrator.',
      steps: [
        {
          title: 'Open Warehouse screen',
          body: 'On a phone, open Inventory and choose the Warehouse screen tab.',
          where: 'Warehouse screen',
        },
        {
          title: 'Choose what to do',
          body: 'Choose Receive, Issue, Move or Count.',
        },
        {
          title: 'Scan or type the codes',
          body: 'Give the location (warehouse code, a slash, the location code) and the product (its number or SKU), and choose Find. Scan uses the camera where the browser can read codes and you allow it; typing always works.',
          where: 'Scan',
        },
        {
          title: 'Give the quantity and save',
          body: 'For Issue or Move, give the Quantity (and the location it goes to) and an optional Reference, then choose Issue or Move. For Count, choose the open count and Save counts.',
        },
        {
          title: 'Receive against an order',
          body: 'For Receive, choose the Purchase order and the line, where to put it away, the Quantity received, the lot, serial numbers and expiry when tracked, and the Delivery reference, then choose Receive. Record damaged or rejected goods from the order’s page instead.',
          where: 'Receive',
        },
      ],
    },
    {
      id: 'value-and-trace',
      title: 'Check stock value and trace a lot',
      outcome: 'You know what stock is worth, how it moved, and where a lot or serial number came from and went.',
      steps: [
        {
          title: 'Open Valuation',
          body: 'The Valuation tab shows the Stock value, the Costing method, and each product’s quantity, unit cost, value and standard cost. Filter by warehouse and choose Export CSV. Stock value is kept in the ERP; it is not posted to Finance’s ledger.',
          where: 'Valuation',
        },
        {
          title: 'Open Movements',
          body: 'The Movements tab is the ledger: every change to stock with its type, quantity, value, document, reference, who and when. Nothing in it is ever changed or deleted.',
          where: 'Movements',
        },
        {
          title: 'Trace a lot or serial number',
          body: 'Choose a lot or serial number on a product’s stock page, or type one and choose Trace. You see Where it came from (supplier, purchase order and receipt), Where it is now, its Inspections and nonconformances, Where it went (manufacturing orders and customer deliveries) and Every movement.',
          where: 'Trace',
        },
        {
          title: 'Use the stock reports',
          body: 'The Reports page in the module rail has Stock on hand, Stock valuation, Stock movements, Stock ageing, Slow-moving stock and Shortages, each with filters and a CSV (see /learn/reports/).',
        },
      ],
    },
  ],
  buttons: [
    { label: 'Act…', does: 'Opens the actions for one stock row: Issue, Move, Reserve, Quarantine, Return to supplier, Scrap, or Release from quarantine.', when: 'For any change to stock at a location.', after: 'The movement is written to the ledger at once.' },
    { label: 'Stock settings', does: 'Sets lot, serial and expiry tracking, inspection on receipt, reorder point, minimum, maximum and usual location for a product.', when: 'Before the first receipt of a product.' },
    { label: 'New warehouse', does: 'Adds a warehouse.', when: 'When stock is kept in a new place.' },
    { label: 'Add a location', does: 'Adds a location, or with Inside one within another.', when: 'To build the store, zone, rack, shelf and bin tree.' },
    { label: 'Print QR labels', does: 'Shows every location’s QR label for printing.', when: 'After setting up locations, for the warehouse screen.' },
    { label: 'New adjustment', does: 'Corrects stock up or down with a reason.', when: 'When stock does not match what is there.', after: 'Above the threshold it waits for a warehouse manager.' },
    { label: 'New count', does: 'Opens a stocktake or a cycle count with the quantities at that moment.', when: 'To check stock against the shelves.' },
    { label: 'Approve and post', does: 'Approves a submitted count and posts its variances as movements, once.', when: 'Warehouse managers only, never on a count they submitted.' },
    { label: 'Customer return', does: 'Brings goods a customer sent back into a location.', when: 'For a return outside a sales order.' },
    { label: 'Trace', does: 'Shows where a lot or serial number came from and everywhere it went.', when: 'For a recall, a complaint or an audit trail.' },
    { label: 'Export CSV', does: 'Downloads the stock list, movements or valuation with your filters.', when: 'To work with the figures in a spreadsheet.' },
  ],
  faqs: [
    {
      q: 'Why can I not issue more than is on hand?',
      a: 'Stock never goes below zero while the company’s setting Allow stock below zero is off (it is off by default). If two people issue the last unit at the same moment, one of them is refused. An ERP administrator can allow negative stock; turning it off again is refused while any stock is below zero.',
    },
    {
      q: 'Why is my adjustment waiting for approval?',
      a: 'It is worth more than the company’s adjustment approval threshold, or no threshold is set (then every adjustment waits). A warehouse manager who did not ask for it approves it.',
    },
    {
      q: 'Can I edit or delete a stock movement?',
      a: 'No. The ledger is append-only: the database refuses changes to a movement and its deletion. Correct a mistake with an adjustment, which is a movement of its own.',
    },
    {
      q: 'Why can I not change the costing method or turn on lot tracking?',
      a: 'The costing method and stock currency lock at the first stock movement, so values stay consistent. Lot and serial tracking can change only while the product has no stock.',
    },
    {
      q: 'Why is stock in quarantine not available?',
      a: 'Stock in a quarantine location is held back until it is released. A quality manager releases it in Quality, or a warehouse role chooses Release from quarantine on the stock row (see /learn/quality/).',
    },
    {
      q: 'Why can I not release or issue a reservation?',
      a: 'A reservation that belongs to a sales order is protected in Inventory. Release it from the sales order in Supply Chain with Release the allocation (see /learn/supply-chain/).',
    },
    {
      q: 'Is stock value posted to Finance’s ledger?',
      a: 'No. Stock is valued in the ERP. Each movement that changes value records the Finance posting it would need as planned, and nothing is posted.',
    },
    {
      q: 'The camera does not read codes on my phone. What can I do?',
      a: 'Reading codes with the camera depends on the browser and needs your permission. Typing the code under the label always works.',
    },
  ],
  related: ['procurement', 'manufacturing', 'supply-chain', 'quality', 'maintenance', 'products', 'reports'],
  chain: ['procurement', 'inventory', 'manufacturing', 'supply-chain'],
  workflows: ['procure-to-pay', 'bom-to-production', 'make-to-order', 'sales-order-to-delivery', 'production-to-quality'],
  notYet: [
    { text: 'Posting stock value to Finance’s ledger (each movement records it as planned; nothing is posted).', status: 'planned' },
    { text: 'Work in progress held as stock in work-in-progress locations (materials issued to a manufacturing order leave stock today).', status: 'planned' },
    { text: 'Replenishment orders and transfers between sites.', status: 'planned' },
    { text: 'More than one stock currency (goods bought in another currency are valued at standard cost today).', status: 'planned' },
  ],
  keywords: [
    'stock', 'inventory', 'warehouse', 'bin', 'location', 'stock on hand', 'SOH', 'stocktake', 'cycle count',
    'stock adjustment', 'write-off', 'scrap', 'quarantine', 'reservation', 'lot', 'batch', 'serial number', 'expiry',
    'FIFO', 'weighted average', 'valuation', 'traceability', 'QR code', 'barcode', 'reorder point',
  ],
  sources: [
    'apps/work/src/client/system/erp/Inventory.tsx',
    'apps/work/src/client/system/erp/WarehouseScreen.tsx',
    'apps/work/src/client/system/erp/ErpSettings.tsx',
    'apps/work/src/client/system/erp/api.ts',
    'apps/work/src/client/system/SystemApp.tsx',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/stock.ts',
    'apps/work/src/worker/erp/inventory.ts',
    'docs/erp/release-2.md',
    'docs/erp/release-5-supply-chain.md',
    'docs/erp/STATUS.md',
    'src/data/erp-capabilities.ts',
  ],
  updated: '2026-11-20',
};

export default guide;
