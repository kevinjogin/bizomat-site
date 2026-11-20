import type { Guide } from '../types.ts';

const guide: Guide = {
  id: 'trouble-records',
  section: 'troubleshooting',
  title: 'Records, forms and approvals',
  status: 'live',
  what: 'What to do when a form will not save, a record cannot be changed, an approval is waiting or refused, something was archived or deleted, or an import did not do what you expected. Each answer starts from the message the application shows.',
  purpose: [
    'Understand why a form is refused and fix it.',
    'Know why a record waits for approval, and who approves it.',
    'Change something that is released, posted or locked the right way.',
    'Find and restore archived or deleted records.',
    'Import CSV files without duplicates.',
  ],
  who: [
    'Anyone entering or changing records.',
    'Approvers: engineering approvers, procurement managers, warehouse managers and quality managers.',
    'Finance users correcting entries.',
    'People importing contacts, leads, companies or bank statements.',
  ],
  tutorials: [
    {
      id: 'wont-save',
      title: 'Find out why a record will not save or change',
      outcome: 'You know what the message means and how to make the change the application allows.',
      steps: [
        {
          title: 'Read the message',
          body: 'The reason shows at the top of the form or in a message at the bottom of the screen. It names the field, the status or the rule that stopped the change.',
        },
        {
          title: 'Fix the fields',
          body: '"Invalid request" means a field is empty, too long or in the wrong form. On a Projects and Tasks board, "Required:" followed by column names lists the columns you must fill in first.',
        },
        {
          title: 'Check the status',
          body: 'Many records change only in some statuses, for example "Only a draft is submitted" or "Only a completed work order can be closed". Move the record to the status the message names, or use the action it suggests.',
        },
        {
          title: 'Check whether it is released, posted or archived',
          body: 'A released product revision says "is released and locked. Start a new revision to change it." Finance says "Posted entries cannot be changed; reverse them instead." An archived board says "Board is archived. Restore it before editing." Follow the action the message gives.',
        },
        {
          title: 'Refresh if someone else changed it',
          body: 'Messages such as "changed meanwhile: reload it" or "The stock or the order changed at the same moment" mean another person saved first. Refresh the page and make your change again.',
        },
        {
          title: 'Check your permission',
          body: 'A message that starts "Only" or "You do not have permission" is about your role, not the record (see /learn/trouble-access/).',
        },
      ],
      after: 'If the message is still unclear, note it word for word and contact BIZOMAT support through the contact page. (Report a fault in the module rail is for equipment faults: it raises a maintenance request.)',
    },
    {
      id: 'restore',
      title: 'Find and restore something archived or deleted',
      outcome: 'The record is back where you can work on it, or you know it cannot come back.',
      steps: [
        {
          title: 'A CRM record',
          body: 'Deleted leads, contacts, companies, deals and activities move to Deleted. In the list, open the menu and choose Deleted, select the records and choose Restore, or open one and choose Restore.',
          where: 'Deleted',
        },
        {
          title: 'A board in Projects and Tasks',
          body: 'Open Boards and choose the Archived tab. Open the board\'s menu and choose Restore. Archived boards are read-only and hidden from lists until restored.',
          where: 'Archived',
        },
        {
          title: 'A product in Products and Engineering',
          body: 'In the product list, open Filters and set Show to Archived. Open the product and choose Restore. Its revisions, documents and history stayed with it.',
          where: 'Restore',
        },
        {
          title: 'A task or item deleted in Projects and Tasks',
          body: 'Deleting an item is permanent: the item, its subitems, updates and files are gone, and it cannot be restored. Next time, use Archive to keep it out of the way instead.',
        },
      ],
      after: 'An archived asset, location, warehouse or meter must be restored before new work can use it.',
    },
  ],
  faqs: [
    {
      q: 'What does "Invalid request" mean?',
      a: 'One of the values in the form did not pass the server\'s checks: a required field is empty, a text is too long, or a number or date is not valid. Check each field you filled in, especially ones you pasted.',
    },
    {
      q: 'A board says "Required:" and some column names.',
      a: 'The board makes those columns required. Fill them in on the task, then save again.',
    },
    {
      q: 'Why is my record waiting for approval?',
      a: 'Some records need a second person. A submitted requisition waits for a procurement manager. A purchase order over the company\'s approval limit shows Awaiting approval until a procurement manager approves it; at or below the limit it is approved on submit. A new supplier is Pending approval until a procurement manager approves it. A submitted change order waits for an engineering approver, a stock adjustment over the threshold for a warehouse manager, and a draft engineering document for an engineering approver.',
    },
    {
      q: 'It says someone else must approve it (segregation of duties).',
      a: 'For example "You drafted this change order, so another engineering approver must approve and release it." Nobody approves what they drafted, created, raised, submitted or counted. Ask another approver in the company. A company of one person is allowed an exception, which is recorded on the record.',
    },
    {
      q: 'I cannot use a supplier on a request for quotation or purchase order.',
      a: 'Only approved suppliers can be used: the message says the supplier "is not an approved supplier". Ask a procurement manager to approve it, or to take it off hold (see /learn/procurement/).',
    },
    {
      q: 'A product revision is "released and locked".',
      a: 'A released revision never changes, so what was built from it stays on record. Choose New revision (or raise a change order), change the draft, then approve and release it through a change order (see /learn/products/).',
    },
    {
      q: 'A manufacturing order says the product has no released bill of materials or routing.',
      a: 'Production uses only released structures. Release a bill of materials through a change order, and release a routing revision, then make the order (see /learn/manufacturing/).',
    },
    {
      q: 'Can I change or delete a posted Finance entry?',
      a: 'No. "Posted entries cannot be changed; reverse them instead." Posted transactions and approved documents are voided, not deleted, and a date in a locked period cannot be used. Reverse or void the entry and enter it again correctly (see /learn/finance/).',
    },
    {
      q: 'Why does stock, production or maintenance value not show in the Finance ledger?',
      a: 'Those values are not posted to Finance\'s ledger: each posting is recorded as planned. Finance gets draft bills from goods receipts and draft invoices and credit notes from shipments and returns, through its own approval.',
    },
    {
      q: 'I deleted a CRM record by mistake.',
      a: 'It moved to Deleted with its history. In the list, open the menu, choose Deleted, select it and choose Restore.',
    },
    {
      q: 'I deleted a task in Projects and Tasks. Can I get it back?',
      a: 'No. Deleting an item permanently deletes it with its subitems, updates and files. Archive tasks you want to keep but hide.',
    },
    {
      q: 'It says the board, asset or location is archived.',
      a: '"Board is archived. Restore it before editing." and "That asset is archived. Restore it first." An archived record is read-only or cannot take new work. Restore it, if you have the right to, then try again.',
    },
    {
      q: 'How do I import contacts, leads or companies into the CRM?',
      a: 'Open the list and choose Import (it needs the import right in your CRM role). Choose a CSV file with a header row (UTF-8; commas or semicolons), match each column to a CRM field or Leave out, and choose what happens when a record already exists: Skip the row, Update the existing record or Create another record. Owners are matched by email or name, and companies by name.',
    },
    {
      q: 'My bank statement import was refused.',
      a: 'Finance imports CSV, OFX and QIF statements, at most 5,000 lines at a time: split a longer file. Your Finance role must include importing statements.',
    },
    {
      q: 'It says the stock currency or costing method cannot change.',
      a: '"The costing method is locked: it was fixed by the first stock movement and cannot change", and the stock currency is fixed once stock has moved. They keep every past value correct. Choose them before the first movement (see /learn/inventory/).',
    },
    {
      q: 'Can I move a task or a CRM record to another company?',
      a: 'Not yet. Moving tasks, contacts, leads and companies to another company is built but switched off for now. Deals and posted Finance entries are never moved.',
    },
    {
      q: 'How do I get my records out?',
      a: 'ERP lists have Export CSV; CRM lists have Export where your role allows it. Your own data can be exported from Projects and Tasks, Settings, Security, Export your data (see /learn/data-management/).',
    },
  ],
  related: ['trouble-access', 'data-management', 'roles-and-permissions', 'products', 'finance', 'crm', 'projects'],
  workflows: ['procure-to-pay', 'engineering-change', 'invoice-to-payment'],
  notYet: [
    { text: 'Moving tasks and CRM records to another company: built, but switched off for now.', status: 'in-development' },
    { text: 'Posting stock, production and maintenance values to the Finance ledger.', status: 'planned' },
  ],
  keywords: ['error', 'cannot save', 'validation', 'required field', 'approval', 'pending', 'awaiting approval', 'segregation of duties', 'locked', 'released', 'posted', 'archived', 'restore', 'undo delete', 'recycle bin', 'import', 'CSV', 'duplicate'],
  sources: [
    'apps/work/src/worker/lib/util.ts',
    'apps/work/src/worker/erp/access.ts',
    'apps/work/src/worker/erp/engineering.ts',
    'apps/work/src/worker/erp/changes.ts',
    'apps/work/src/worker/erp/purchasing.ts',
    'apps/work/src/worker/erp/inventory.ts',
    'apps/work/src/worker/erp/documents.ts',
    'apps/work/src/worker/services/permissions.ts',
    'apps/work/src/worker/crm/routes-records.ts',
    'apps/work/src/worker/fin/routes-banking.ts',
    'apps/work/src/client/system/erp/api.ts',
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/client/system/erp/common.tsx',
    'apps/work/src/client/crm/RecordList.tsx',
    'apps/work/src/client/crm/RecordPage.tsx',
    'apps/work/src/client/pages/Boards.tsx',
    'apps/work/src/client/board/BoardSettings.tsx',
    'apps/work/src/client/board/TableView.tsx',
    'apps/work/src/client/board/ItemPanel.tsx',
    'apps/work/src/client/pages/settings/Security.tsx',
    'docs/platform/moving-records.md',
  ],
  updated: '2026-11-20',
};

export default guide;
