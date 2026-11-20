// Preventive maintenance (Maintenance stages M2 and M3): schedules by time, meter or condition (per asset or through a
// template for a class of assets) that make one work order per due occurrence, done with an inspection and parts, after
// which the schedule moves on.
import type { Workflow } from '../types.ts';

const workflow: Workflow = {
  id: 'preventive-maintenance',
  title: 'Preventive maintenance',
  status: 'live',
  summary:
    'Preventive work is made by itself when it is due. A schedule per asset, or a template for a class of assets, by time, meter or condition makes one work order per due occurrence; the technician does it with its inspection and parts, and completing it moves the schedule on.',
  stages: [
    { guide: 'maintenance', label: 'Assets and meters', detail: 'The assets are in the register. Assets maintained by usage or condition have a meter (hours, kilometres, cycles) or a gauge (temperature, pressure) with readings.' },
    { guide: 'maintenance', label: 'Checklists', detail: 'Inspection templates list what to check (pass or fail, a number with limits, or text) and what a failed inspection makes: a corrective work order, a request or nothing.' },
    { guide: 'maintenance', label: 'Schedule', detail: 'A supervisor sets the trigger (every so many days, weeks, months or meter units, or a reading outside limits), the lead days and the work order it makes.' },
    { guide: 'maintenance', label: 'Generation', detail: 'Due work orders are made every 15 minutes, by Generate due work orders now, and straight after each reading, once per due occurrence.' },
    { guide: 'maintenance', label: 'The work', detail: 'The technician does the work order with its tasks, inspection, timer and readings, and completes it.' },
    { guide: 'inventory', label: 'Parts', detail: 'Parts listed on the schedule are issued from the maintenance stores through Inventory when the work is done.' },
    { guide: 'reports', label: 'Calendar and reports', detail: 'The Calendar shows what is coming; the Reports tab shows preventive work due in a period as on time, late, missed or skipped.' },
  ],
  tutorial: {
    id: 'preventive-maintenance-walkthrough',
    title: 'Set up preventive maintenance and do the first job',
    outcome: 'A schedule makes its work orders when due, and completing one moves the next due date on.',
    needs: 'Supervisor or maintenance administrator to set up; the assigned technician to do the work.',
    steps: [
      { title: 'Add a meter, if needed', body: 'For a schedule by meter or condition, open the asset in Assets and, under Meters and gauges, choose Add. Give the name, unit and expected range.', where: 'Meters and gauges' },
      { title: 'Write the checklist', body: 'In Checklists, choose New template. Give the Name and When an inspection fails (Make a corrective work order, Raise a request, or Nothing (record only)). Add items with Add an item: Pass or fail, Number (with unit, minimum and maximum) or Text, ticking Required as needed. Choose Save template.', where: 'New template' },
      { title: 'Make the schedule', body: 'In Preventive, choose New schedule and pick the asset. Give the Name and choose the Trigger: Time based (Every, Unit, Counted From the last completion or On fixed dates, First due), Meter based (the meter and Every (meter units)) or Condition based (the meter or gauge and When a reading is below or above).', where: 'New schedule' },
      { title: 'Describe the work order it makes', body: 'Set the Lead days, Job type (Preventive or Inspection), Priority, Estimated hours, Trade, Technician, the Inspection checklist, Tasks (one a line), Required parts, Instructions and Safety requirements. Choose Save schedule.', where: 'Save schedule' },
      { title: 'Cover a class of assets, if you like', body: 'Choose Templates for asset classes, then New template. Give the Asset category, Only in the site if wanted, and for meter or condition triggers the Meter or gauge name on each asset. Choose Save template. Every asset of that category gets its own schedule, including assets added later; Apply to new assets now does it at once.', where: 'Templates for asset classes' },
      { title: 'Let it make the work orders', body: 'Due work orders are made by the run every 15 minutes, and after each reading for meter and condition schedules. Choose Generate due work orders now to make them at once.', where: 'Generate due work orders now' },
      { title: 'Check the Calendar', body: 'Choose Calendar for open preventive work orders, the next due dates and those after them, and meter-based work projected from the meter\'s daily use. Condition-based schedules are listed under Not on the calendar.', where: 'Calendar' },
      { title: 'Do the work', body: 'The technician opens the work order (it says Made by preventive maintenance), runs the timer, records the inspection with Save results and Complete the inspection, issues the parts and chooses Complete.', where: 'Complete the inspection' },
      { title: 'See the schedule move on', body: 'On the schedule, Work orders made lists each occurrence with On time or Late. Counted from the last completion, the next due date counts from the completion date (or the meter total then).', where: 'Work orders made' },
    ],
    after: 'Supervisors read the Reports tab for preventive work due in a period: on time, late, missed or skipped.',
  },
  faqs: [
    { q: 'Why was no work order made?', a: 'Check that the schedule is Active, not Paused. A time-based schedule makes its work order only once its due date less the lead days has come. A schedule holds one outstanding work order at a time, so a new one waits until the last is completed or cancelled. A template skips assets that do not have the named meter and lists them. A condition schedule counts only readings taken after its last work order was completed or cancelled.' },
    { q: 'Can the same occurrence make two work orders?', a: 'No. Each due date, meter value or reading has a key, and the work order is written with it in one step, so two runs at the same moment make one work order.' },
    { q: 'What happens if I cancel a preventive work order?', a: 'That occurrence is skipped and counts as skipped in the reports. A schedule counted from the last completion moves on from its due date. Reopening the work order takes its place back.' },
    { q: 'Can I move the next due date?', a: 'Yes, for a time-based schedule with no open work order: on the schedule, a supervisor enters a new date and chooses Move the next due date.' },
    { q: 'Will BIZOMAT plan the schedules for me?', a: 'Not yet. An AI scheduling assistant that only proposes, for a person to approve, and technician workload planning are planned (see /learn/maintenance/).' },
  ],
  keywords: ['PM', 'preventive maintenance', 'planned maintenance', 'scheduled maintenance', 'service interval', 'meter based', 'usage based', 'condition based', 'condition monitoring', 'inspection checklist', 'maintenance calendar', 'recurring work order'],
  sources: [
    'docs/maintenance/README.md',
    'apps/work/src/client/system/maintenance/Preventive.tsx',
    'apps/work/src/client/system/maintenance/Checklists.tsx',
    'apps/work/src/client/system/maintenance/AssetExtras.tsx',
    'apps/work/src/client/system/maintenance/WorkOrderExtras.tsx',
    'apps/work/src/client/system/maintenance/MtReports.tsx',
    'apps/work/src/client/system/maintenance/api.ts',
  ],
  updated: '2026-11-20',
};

export default workflow;
