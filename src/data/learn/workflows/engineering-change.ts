import type { Workflow } from '../types.ts';

// Engineering change: change request, change order, new revision, approval and release with segregation of duties.
// Labels from apps/work/src/client/system/erp/Changes.tsx and Products.tsx; rules from
// apps/work/src/worker/erp/changes.ts and access.ts.
const workflow: Workflow = {
  id: 'engineering-change',
  title: 'Engineering change',
  status: 'live',
  summary:
    'How a released product is changed under control: someone asks for a change, an engineering approver reviews it, a change order carries the new revision, and an approver who did not draft the order approves and releases it, so the old revision is superseded.',
  stages: [
    { guide: 'products', label: 'Change request', detail: 'Says what should change and why. An engineering approver takes it under review and approves or rejects it.' },
    { guide: 'products', label: 'Change order', detail: 'Made from the approved request, or drafted directly. Each product gets a new draft revision with the lines of its released one.' },
    { guide: 'products', label: 'New revision', detail: 'The draft revision’s bill of materials is changed and compared with the released one, then locked on submit.' },
    { guide: 'products', label: 'Approval and release', detail: 'An engineering approver who did not draft the order approves and releases it; the earlier released revision becomes superseded.' },
    { guide: 'manufacturing', label: 'Use in production', detail: 'New manufacturing orders use the new released revision; orders already released keep the one they were released with.' },
  ],
  tutorial: {
    id: 'engineering-change-walkthrough',
    title: 'Change a released product',
    outcome: 'The product has a new released revision, the old one is superseded, and the change is recorded with who asked, approved and released it.',
    needs: 'Engineers and engineering approvers raise changes. An engineering approver reviews requests, and one who did not draft the change order approves and releases it.',
    steps: [
      {
        title: 'Request the change',
        body: 'On the product choose Request a change, or on the Changes tab choose New change request. Give a Title (required), the Reason, a Description and the products concerned, then choose Raise the request.',
        where: 'Request a change',
      },
      {
        title: 'Review the request',
        body: 'An engineering approver opens it under Changes, Change requests. Take under review shows it is being looked at; then choose Approve (a note is optional) or Reject (a reason is required).',
        where: 'Take under review',
      },
      {
        title: 'Make the change order',
        body: 'On the approved request, an engineer or engineering approver chooses Make a change order, then Draft the change order. Each product gets a new revision in the order (or its open draft revision), with the lines of its released revision to change.',
        where: 'Make a change order',
      },
      {
        title: 'Change the new revision',
        body: 'Under Revisions in this change order, open each revision. On the product’s Bill of materials tab, add, change or remove lines while the order is a draft. The compare link in the Replaces column shows what was added, removed and changed against the revision it replaces.',
        where: 'Revisions in this change order',
      },
      {
        title: 'Submit for approval',
        body: 'Choose Submit for approval. The revisions lock. If something needs to change, an approver chooses Return to draft and says what; that unlocks them.',
        where: 'Submit for approval',
      },
      {
        title: 'Approve the change order',
        body: 'An engineering approver who did not draft it chooses Approve. In a company of one person the drafter may approve, and the exception is recorded.',
        where: 'Approve',
      },
      {
        title: 'Release it',
        body: 'Choose Release and confirm. In one step the order is released, each product’s new revision becomes released and locked, and its earlier released revision becomes superseded. If two people release at the same moment, only one release happens.',
        where: 'Release',
      },
    ],
    after: 'The Revisions tab of each product lists the revisions with their change order, who released them and when; the revisions and changes report lists every change order and its approvals.',
  },
  faqs: [
    {
      q: 'Do I need a change request before a change order?',
      a: 'No. A change request is for asking and reviewing. An engineer can draft a change order directly with New change order on the Changes tab, or Change order on a product with an open draft revision.',
    },
    {
      q: 'Can I undo a release?',
      a: 'No. A released revision stays as it was released. Make another change order with a new revision to change it again.',
    },
    {
      q: 'What happens to manufacturing orders already released?',
      a: 'They keep the bill of materials and routing they were released with. Draft orders follow the released revisions when they are next saved.',
    },
    {
      q: 'What does Cancel do to the revisions?',
      a: 'Cancelling a change order leaves its revisions as plain drafts of their products, with their lines. They can go into another change order later.',
    },
    {
      q: 'Why can I not approve a change order?',
      a: 'Only engineering approvers and ERP administrators approve and release change orders, and never one they drafted (segregation of duties), except in a company of one person (see /learn/roles-and-permissions/).',
    },
  ],
  keywords: ['ECR', 'ECO', 'ECN', 'engineering change request', 'engineering change order', 'engineering change notice', 'revision', 'change control', 'release', 'supersede'],
  sources: [
    'apps/work/src/client/system/erp/Changes.tsx',
    'apps/work/src/client/system/erp/Products.tsx',
    'apps/work/src/worker/erp/changes.ts',
    'apps/work/src/worker/erp/access.ts',
    'docs/erp/release-1.md',
    'docs/erp/release-3.md',
  ],
  updated: '2026-11-20',
};

export default workflow;
