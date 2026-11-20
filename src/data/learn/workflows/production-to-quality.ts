// Production to quality (ERP Releases 3 and 4 part A): inspection points of manufacturing operations and finished
// goods checked in Quality, failed lots quarantined through Inventory, nonconformances and corrective actions.
import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: 'production-to-quality',
  title: 'Production to quality',
  status: 'live',
  summary:
    'Work made in Manufacturing is checked against released inspection plans at its operations and as finished goods. A failure is held in quarantine, raised as a nonconformance, dispositioned once and fixed with a corrective action that someone independent approves and closes.',
  stages: [
    { guide: 'quality', label: 'Inspection plans', detail: 'A quality manager releases in-process plans (for a routing\'s operation) and final plans (for finished goods), with each characteristic\'s limits and samples.' },
    { guide: 'manufacturing', label: 'Operation with an inspection point', detail: 'An operation with an inspection point needs a result before it completes: a simple Pass or Fail on the shop floor, or a full inspection to the plan.' },
    { guide: 'quality', label: 'Inspection', detail: 'Readings are recorded on a phone; the server compares each with its limits and works out the result.' },
    { guide: 'manufacturing', label: 'Finished goods', detail: 'Finished goods are received at the order\'s actual cost. Those of a product with a released final plan wait for a final inspection.' },
    { guide: 'inventory', label: 'Quarantine', detail: 'A failed lot moves into a quarantine location through Inventory, in the same step as the failed inspection or later.' },
    { guide: 'quality', label: 'Nonconformance', detail: 'Containment, root cause and a disposition decided once by a quality manager, carried out through Inventory: scrap, return, release, or a rework or repair note.' },
    { guide: 'quality', label: 'Corrective action', detail: 'Proposed, approved by a quality manager who neither proposed it nor does it, done with evidence, checked for effectiveness and closed.' },
    { guide: 'reports', label: 'Quality reports', detail: 'Inspection results, rejection rates, the NCR register, corrective actions, rework and the cost of poor quality, each with CSV.' },
  ],
  tutorial: {
    id: 'production-to-quality-walkthrough',
    title: 'Inspect a production run and deal with a failure',
    outcome: 'The run is inspected, a failed lot is held and dispositioned, and the cause has a corrective action through to closure.',
    needs: 'A quality manager (plans, dispositions, approvals), a quality inspector (inspections), and production operators and managers (operations and finished goods).',
    steps: [
      { title: 'Release the plans', body: 'In Quality, Inspection plans, choose New inspection plan with the kind In-process (and, if you like, the routing and operation) or Final, add the characteristics and have a quality manager choose Release.', where: 'New inspection plan' },
      { title: 'Inspect at the operation', body: 'When an operation with an inspection point is in progress, it waits on the Quality Overview under Waiting for inspection. An inspector chooses Start inspection there, or Full inspection on the manufacturing order\'s operation. On the shop floor, an operator can instead record a simple Pass or Fail with Inspection.', where: 'Full inspection' },
      { title: 'Record and complete', body: 'Enter each reading or choose Conforms or Does not, add any photo needed, save the readings and choose Complete. Once a full inspection is started, the operation completes only after it passes or is accepted on condition.', where: 'Complete' },
      { title: 'Inspect the finished goods', body: 'After Receive finished goods on the manufacturing order, finished goods of a product with a released final plan wait on the Quality Overview. Choose Start inspection, record and complete it.', where: 'Start inspection' },
      { title: 'Hold a failed lot', body: 'If it fails, tick Put the lot into quarantine now in the Complete dialog, and choose where the stock is and the quarantine location.', where: 'Put the lot into quarantine now' },
      { title: 'Raise the nonconformance', body: 'On the failed inspection, choose Raise a nonconformance. Choose Record containment, then Record the root cause with Five whys or Free text.', where: 'Raise a nonconformance' },
      { title: 'Decide and carry out the disposition', body: 'A quality manager chooses Decide the disposition (use as is, rework, repair, scrap, return to supplier, regrade), then Carry it out for each line. Rework is a note here; the rework itself is reported at an operation on the shop floor.', where: 'Decide the disposition' },
      { title: 'Fix the cause', body: 'Choose Propose an action. A quality manager who did not propose it and is not responsible approves it; the responsible person chooses Start and Done with evidence; a quality manager chooses Check effectiveness, then Close.', where: 'Propose an action' },
      { title: 'Close the nonconformance', body: 'When every disposition line is done and its actions are settled, choose Ready for verification, then a quality manager chooses Verify and close.', where: 'Verify and close' },
      { title: 'Read the results', body: 'Open Reports, then Rework and Cost of poor quality, to see rework time at its cost and scrap at its value in the stock ledger.' },
    ],
    after: 'A trace of the lot in Inventory lists its inspections and nonconformances beside every movement.',
  },
  faqs: [
    { q: 'Why will the operation not complete?', a: 'An operation with an inspection point needs its result first. If a full inspection was started for it, the inspection must pass, or a quality manager must accept it on condition (see /learn/manufacturing/).' },
    { q: 'Does rework under a nonconformance make a manufacturing order?', a: 'No. Rework and repair are recorded as a note on the nonconformance. The work itself is reported as rework at an operation on the shop floor, and the Rework report shows both.' },
    { q: 'Why do my finished goods not wait for a final inspection?', a: 'Only finished goods of a product with a released final plan wait, and only those received after the plan was released.' },
    { q: 'Is scrap posted to Finance?', a: 'No. Scrap moves stock in Inventory at its value in the stock ledger. Its Finance posting is recorded as planned; nothing is posted.' },
  ],
  keywords: ['in-process inspection', 'final inspection', 'inspection point', 'shop floor', 'NCR', 'nonconformance', 'quarantine', 'disposition', 'scrap', 'rework', 'CAPA', 'corrective action', 'cost of poor quality'],
  sources: [
    'docs/erp/release-4-quality.md',
    'docs/erp/release-3.md',
    'apps/work/src/client/system/erp/Quality.tsx',
    'apps/work/src/client/system/erp/Manufacturing.tsx',
    'apps/work/src/client/system/erp/ShopFloor.tsx',
    'apps/work/src/worker/erp/quality.ts',
    'apps/work/src/worker/erp/ncr.ts',
  ],
  updated: '2026-11-20',
};

export default workflow;
