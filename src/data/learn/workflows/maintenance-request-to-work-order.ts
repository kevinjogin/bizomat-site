// Maintenance request to work order (Maintenance stages M1 to M3): a fault reported from any screen, approved, turned
// into one work order, worked with time, parts from ERP Inventory and downtime, completed and closed.
import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: 'maintenance-request-to-work-order',
  title: 'Maintenance request to work order',
  status: 'live',
  summary:
    'A fault reported by anyone in the company becomes finished work. A supervisor approves the request and turns it into one work order (or attaches it to open work), a technician does the job with time, parts and downtime recorded, and a supervisor closes it.',
  stages: [
    { guide: 'maintenance', label: 'Report a fault', detail: 'Anyone in the company reports a fault from Report a fault at the foot of the rail, on any screen, with the asset and a photo if they can.' },
    { guide: 'maintenance', label: 'Approval', detail: 'When the company requires approval (on by default), a supervisor approves, declines with a reason, or asks for more information.' },
    { guide: 'maintenance', label: 'Work order', detail: 'The request becomes one work order with job type, priority, technician and due date, or joins open work on the same asset.' },
    { guide: 'inventory', label: 'Parts', detail: 'Parts are issued from warehouses marked as maintenance stores, through Inventory, never below zero; unused parts are returned.' },
    { guide: 'maintenance', label: 'Completion and close', detail: 'The technician completes the work order with notes; it is locked. A supervisor closes it, or reopens it with a reason.' },
    { guide: 'reports', label: 'Reliability and costs', detail: 'Downtime, labour and parts feed the Reliability, Backlog, Breakdown trends and Asset costs reports.' },
  ],
  tutorial: {
    id: 'maintenance-request-to-work-order-walkthrough',
    title: 'From a fault report to a closed work order',
    outcome: 'The fault is fixed, and its time, parts, downtime and notes are on record against the asset.',
    needs: 'Anyone to report; a supervisor or maintenance administrator to approve, make, close and reopen work orders; the assigned technician to do the work.',
    steps: [
      { title: 'Report the fault', body: 'Choose Report a fault at the foot of the module rail. Fill in What is wrong, or what needs doing?, choose the Asset (if you know it), add Photos or documents and choose Send the request.', where: 'Send the request' },
      { title: 'Review it', body: 'A supervisor opens Maintenance, Requests, Awaiting approval and opens the request.', where: 'Awaiting approval' },
      { title: 'Decide', body: 'Choose Approve, Decline (with a reason the requester sees) or Ask for more information. The requester answers with Give the information.', where: 'Approve' },
      { title: 'Use open work if there is some', body: 'If Open work on this asset lists a work order for the same fault, choose Attach instead of making another.', where: 'Attach' },
      { title: 'Make the work order', body: 'Choose Make a work order, then the Job type (for example Breakdown or Corrective), Priority, Technician, Due finish, Estimated hours and Instructions. Choose Make the work order.', where: 'Make the work order' },
      { title: 'Do the work', body: 'The technician opens Work orders, My work, chooses Start timer, ticks the tasks and adds photos with Add a photo.', where: 'Start timer' },
      { title: 'Record parts and downtime', body: 'Under Parts used, issue each part with Issue. Under Downtime, enter Down from, Back up at and the Cause, and choose Save downtime.', where: 'Issue' },
      { title: 'Complete it', body: 'Choose Stop timer, then Complete, and write what was done and what was found. The work order is locked.', where: 'Complete' },
      { title: 'Close it', body: 'A supervisor checks the work order and chooses Close. If something must be corrected, Reopen asks for the reason.', where: 'Close' },
    ],
    after: 'The asset\'s page shows the work in its Maintenance history; breakdown and corrective work with downtime counts in the Reliability report.',
  },
  faqs: [
    { q: 'Can two supervisors make two work orders from one request?', a: 'No. A request becomes one work order, or joins an open one on the same asset, never two, even if two people press the button at the same moment.' },
    { q: 'Can I report a fault without knowing the asset?', a: 'Yes. Only the description is needed. A supervisor chooses the asset when making the work order.' },
    { q: 'How do I turn approval off?', a: 'A maintenance administrator switches off New requests need approval in Maintenance, Settings, Approval of requests. New requests are then Submitted straight away; a supervisor can still decline them.' },
    { q: 'I cancelled the work order. Why is the request still open?', a: 'Cancelling a work order leaves its requests at Work order made. A supervisor closes each with Close the request.' },
    { q: 'Does the asset show as under maintenance while the work order is open?', a: 'No. A work order\'s status never changes the asset\'s status. A supervisor changes the asset\'s Operating status by editing the asset.' },
  ],
  keywords: ['work request', 'fault report', 'breakdown', 'repair', 'job', 'work order', 'WO', 'technician', 'approval', 'maintenance request', 'corrective maintenance'],
  sources: [
    'docs/maintenance/README.md',
    'apps/work/src/client/system/maintenance/ReportFault.tsx',
    'apps/work/src/client/system/maintenance/Requests.tsx',
    'apps/work/src/client/system/maintenance/WorkOrders.tsx',
    'apps/work/src/client/system/maintenance/WorkOrderExtras.tsx',
    'apps/work/src/client/system/maintenance/Maintenance.tsx',
    'apps/work/src/client/system/maintenance/MtReports.tsx',
    'apps/work/src/worker/maintenance/index.ts',
  ],
  updated: '2026-11-20',
};

export default workflow;
