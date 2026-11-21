import type { Guide } from '../types.ts';

// People and HR in BIZOMAT ERP. Facts: the definitions are apps/work/src/shared/erp-objects/defs/people.ts (employees,
// leave types, leave requests, attendance, job openings, applicants, onboarding templates and checklists, courses,
// training records, performance reviews, goals, pay runs); the rules are apps/work/src/worker/erp/objects/hooks.ts
// (working days, leave balances, the reviewer's and the person's ratings, payroll totals) and actions.ts (hiring, the
// onboarding checklist, working out a pay run); payslips are GET /x/payslips in routes.ts; posting a pay run to Finance
// is postings.ts (test/erp-postings.test.ts). Tested end to end in
// apps/work/test/erp-modules.test.ts ("workflow 7").
const guide: Guide = {
  id: 'people-hr',
  section: 'modules',
  title: 'People and HR',
  short: 'People and HR',
  status: 'live',
  what: 'People and HR keeps employee records, leave with approval and balances, attendance, recruitment, onboarding and offboarding checklists, training, performance reviews and pay runs. Pay details are seen only by the HR manager, payroll officers and the person themselves.',
  purpose: [
    'Keep each employee’s position, department, manager, location, hours and pay basis.',
    'Ask for leave and have it approved by the person’s manager, checked against what is left of the year.',
    'Open a job, move applicants to an offer, and hire one into an employee record with an onboarding checklist.',
    'Record training with its expiry, and run performance reviews with the person’s own ratings.',
    'Work out a pay run from salaries and approved timesheets, approved by someone else; each person sees their payslips.',
  ],
  who: ['HR managers and officers', 'Payroll officers', 'Managers who approve leave, timesheets and reviews', 'Every employee, for their own leave, training, reviews and payslips'],
  access: {
    path: ['BIZOMAT ERP', 'People and HR'],
    href: 'https://bizomat.ai/erp/m/hr',
    label: 'Open People and HR',
    note: 'Recruitment, onboarding, training, performance and payroll are their own modules in All modules.',
  },
  tutorials: [
    {
      id: 'take-leave',
      title: 'Ask for leave',
      outcome: 'Your leave request is waiting for your manager’s approval.',
      needs: 'An employee record that names your BIZOMAT account (HR links it).',
      steps: [
        { title: 'Open Leave requests', body: 'Choose People and HR in the rail, then Leave requests.', where: 'Leave requests' },
        { title: 'Start a request', body: 'Choose New leave request. Choose yourself as the Employee and the Leave type, then the From and To dates.', where: 'New leave request' },
        { title: 'Save it', body: 'Choose Add the leave request. The working days are worked out (Monday to Friday) and your manager becomes the approver.', where: 'Add the leave request' },
        { title: 'Ask for approval', body: 'Choose Ask for approval. If you ask for more days than are left this year, it says how many are left.', where: 'Ask for approval' },
      ],
      after: 'Your manager approves or rejects it; you get an alert either way.',
    },
    {
      id: 'hire',
      title: 'Hire an applicant',
      outcome: 'The applicant is an employee with an onboarding checklist.',
      needs: 'An HR officer or HR manager; an offer is made by the HR manager.',
      steps: [
        { title: 'Open a job', body: 'In Recruitment, choose New job opening, then Ask for approval. The HR manager approves and opens it.', where: 'New job opening' },
        { title: 'Add the applicant', body: 'In Applicants, choose New applicant with their job opening, and tick that they agreed to us keeping their details.', where: 'New applicant' },
        { title: 'Move them on', body: 'Choose Invite to interview, then (HR manager) Make an offer.', where: 'Make an offer' },
        { title: 'Hire', body: 'Choose Hire and give the start date. Their employee record and the onboarding checklist from your template are made.', where: 'Hire' },
      ],
    },
    {
      id: 'pay-run',
      title: 'Work out and approve a pay run',
      outcome: 'A pay run is worked out and approved by someone other than who made it.',
      needs: 'A payroll officer to work it out; the HR manager or a finance controller to approve it.',
      steps: [
        { title: 'Start the pay run', body: 'In Payroll, choose New pay run with the period, pay date, frequency and the employer contribution rate.', where: 'New pay run' },
        { title: 'Work out the pay', body: 'Choose Work out the pay. Salaried people get their salary for the period; hourly people their approved timesheet hours at their rate; tax withheld is the rate set on their record.', where: 'Work out the pay' },
        { title: 'Check every payslip', body: 'Open the Payslips tab and check the amounts. BIZOMAT is not certified payroll: it uses the rates you set.', where: 'Payslips' },
        { title: 'Approve and record payment', body: 'Someone else chooses Approve. After you pay from your bank, choose Record as paid.', where: 'Approve' },
        { title: 'Post it to Finance', body: 'Choose Post to Finance. One journal goes to the company’s Finance workspace on the pay date: gross pay and the employer contribution as expenses, against tax withheld, the contribution payable and the net pay. It needs a Finance role that may post journals, and the accounts chosen on the Finance postings tab.', where: 'Post to Finance' },
      ],
      after: 'Each person sees their payslip under My payslips. A posted pay run goes back to worked out only after Reverse Finance posting.',
    },
  ],
  buttons: [
    { label: 'Ask for approval', does: 'Sends a leave request, job opening or timesheet to its approver, who gets an alert.' },
    { label: 'Approve', does: 'Approves the record. The person who made it, or whom it is for, cannot approve it.', after: 'The person is told.' },
    { label: 'Hire', does: 'Makes the employee record and the onboarding checklist from an applicant with an offer.' },
    { label: 'Work out the pay', does: 'Makes a payslip for every active employee from their pay basis and approved timesheets in the period.' },
    { label: 'My payslips', does: 'Shows your own payslips from approved pay runs.' },
    { label: 'Post to Finance', does: 'Posts an approved pay run to Finance’s ledger as one balanced journal, once. It makes no payment.', when: 'After approval; your Finance role must be able to post journals.' },
  ],
  faqs: [
    { q: 'Why can I not see an employee?', a: 'Employee records are read by HR roles only. Everyone else sees only their own record, once it names their account.' },
    { q: 'Why does an HR officer not see salaries?', a: 'Pay details are seen only by the HR manager, payroll officers and the person themselves. They are never written into the history either: the history says they changed.' },
    { q: 'Who approves my leave?', a: 'The manager named on your employee record, or the HR manager. You never approve your own.' },
    { q: 'How are leave balances worked out?', a: 'Each leave type gives days a year. Approved and waiting requests that start in the year count against them; the Leave balances report shows what is left.' },
    { q: 'Does BIZOMAT pay people or report to the tax office?', a: 'No. Pay runs are worked out with the rates you set; you pay from your bank and record it. Nothing is reported to any tax authority and it is not certified payroll.' },
    { q: 'Which accounts does a pay run post to?', a: 'The ones an ERP administrator or finance controller chooses on Payroll’s Finance postings tab, suggested from your chart (for example Wages and salaries, Superannuation, PAYG withholding payable). Ask your accountant which to use.' },
    { q: 'Can a person see their own payslip?', a: 'Yes, under My payslips, once a pay run that includes them is approved and their employee record names their account.' },
  ],
  related: ['all-modules', 'roles-and-permissions', 'projects', 'finance'],
  notYet: [
    { text: 'Statutory tax tables, superannuation payments, payment files and Single Touch Payroll: pay runs use the rates you set.', status: 'planned' },
    { text: 'A public careers page for applicants.', status: 'planned' },
  ],
  keywords: ['HR', 'HRM', 'HRIS', 'human resources', 'staff', 'employee records', 'leave', 'annual leave', 'sick leave', 'holiday', 'time off', 'attendance', 'clock in', 'recruitment', 'ATS', 'hiring', 'onboarding', 'offboarding', 'training', 'LMS', 'appraisal', 'performance review', 'payroll', 'payslip', 'pay run', 'salary', 'wages'],
  sources: ['apps/work/src/shared/erp-objects/defs/people.ts', 'apps/work/src/worker/erp/objects/hooks.ts', 'apps/work/src/worker/erp/objects/actions.ts', 'apps/work/src/worker/erp/objects/postings.ts', 'apps/work/test/erp-modules.test.ts', 'apps/work/test/erp-postings.test.ts'],
  updated: '2026-11-20',
};

export default guide;
