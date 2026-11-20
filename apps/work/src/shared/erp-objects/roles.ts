// The ERP roles the module framework adds (20 Nov 2026). They join the roles of src/worker/erp/access.ts (ERP_ROLES),
// are given on the ERP roles page like every other role, and read the rest of the ERP as a viewer does. A company's
// owner and administrators are ERP administrators and may do everything.

export const NEW_ROLES = [
  'hr_manager',
  'hr_officer',
  'payroll_officer',
  'project_manager',
  'service_manager',
  'service_agent',
  'fleet_manager',
  'contracts_manager',
  'marketing_manager',
  'finance_controller',
  'operations_manager',
  'compliance_officer',
] as const;
export type NewRole = (typeof NEW_ROLES)[number];

export const NEW_ROLE_LABELS: Record<NewRole, string> = {
  hr_manager: 'HR manager',
  hr_officer: 'HR officer',
  payroll_officer: 'Payroll officer',
  project_manager: 'Project manager',
  service_manager: 'Service manager',
  service_agent: 'Service agent or technician',
  fleet_manager: 'Fleet and transport manager',
  contracts_manager: 'Contracts manager',
  marketing_manager: 'Marketing manager',
  finance_controller: 'Finance controller',
  operations_manager: 'Operations manager',
  compliance_officer: 'Compliance officer',
};

export const NEW_ROLE_HELP: Record<NewRole, string> = {
  hr_manager: 'People and HR: employees with their pay, leave approval, recruitment, onboarding, training, performance reviews; approves pay runs',
  hr_officer: 'People and HR: employee records without pay, leave, attendance, recruitment, onboarding, training and reviews',
  payroll_officer: 'Payroll: pay runs and pay details; reads employee records',
  project_manager: 'Timesheets (approval and billing), resource planning, project costs, professional services engagements and construction',
  service_manager: 'Customer service, field service jobs, service agreements and dispatch; approves agreements',
  service_agent: 'Works customer service tickets and the field service jobs given to them',
  fleet_manager: 'Vehicles, fuel, trips and transport runs',
  contracts_manager: 'Customer and supplier contracts, their approval and renewals',
  marketing_manager: 'Marketing campaigns, their budgets and results',
  finance_controller: 'Fixed assets, revenue schedules, price lists, commissions, grants and wholesale accounts; approves them',
  operations_manager: 'Organisation structure, stores and daily takings, sites and production, healthcare facilities, subcontracting, trade compliance',
  compliance_officer: 'Controlled documents, environmental records, trade compliance and credentials; approves documents',
};

/** Groups the definitions use (erp_admin may always do everything). */
export const R = {
  HR_ALL: ['hr_manager', 'hr_officer'] as const,
  HR_READ: ['hr_manager', 'hr_officer', 'payroll_officer', 'executive'] as const,
  PAY: ['hr_manager', 'payroll_officer'] as const,
  COST: ['hr_manager', 'payroll_officer', 'project_manager', 'finance_controller', 'executive'] as const,
  SERVICE: ['service_manager', 'service_agent'] as const,
  SERVICE_READ: ['service_manager', 'service_agent', 'sales_manager', 'executive', 'viewer'] as const,
  SALES_READ: ['sales_manager', 'marketing_manager', 'contracts_manager', 'finance_controller', 'executive', 'viewer'] as const,
  FIN: ['finance_controller'] as const,
  FIN_READ: ['finance_controller', 'executive', 'viewer'] as const,
  OPS: ['operations_manager'] as const,
  /** Every person in the company (with any ERP role, including the default viewer). */
  EVERYONE: ['*'] as const,
};

/** The ERP's roles before the framework (src/worker/erp/access.ts keeps the same list; a test checks they agree). */
export const EXISTING_ROLE_LABELS: Record<string, string> = {
  erp_admin: 'ERP administrator',
  executive: 'Executive',
  engineer: 'Engineer',
  engineering_approver: 'Engineering approver',
  buyer: 'Buyer',
  procurement_manager: 'Procurement manager',
  warehouse_manager: 'Warehouse manager',
  warehouse_operator: 'Warehouse operator',
  production_manager: 'Production manager',
  production_operator: 'Production operator',
  quality_manager: 'Quality manager',
  quality_inspector: 'Quality inspector',
  sales_manager: 'Sales manager',
  whs_manager: 'WHS manager',
  whs_officer: 'WHS officer or supervisor',
  whs_investigator: 'Incident investigator',
  whs_hsr: 'Health and safety representative',
  health_officer: 'Health officer',
  viewer: 'Viewer',
};

/** Every ERP role with its label. */
export const ALL_ROLE_LABELS: Record<string, string> = { ...EXISTING_ROLE_LABELS, ...NEW_ROLE_LABELS };
