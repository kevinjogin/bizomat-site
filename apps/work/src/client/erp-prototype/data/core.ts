// Fictional organisation for the prototype. Every name, number and figure here is invented demonstration data; none
// of it describes a real company, person or result. Phone numbers use the 5550 range that Australia reserves for
// fiction, and email addresses use example.com.
export const COMPANIES = [
  { id: 'ee', name: 'Example Engineering Pty Ltd', short: 'Example Engineering', sites: ['Brisbane', 'Sydney'] },
  { id: 'ef', name: 'Example Fabrication Pty Ltd', short: 'Example Fabrication', sites: ['Melbourne'] },
];

export const DEPARTMENTS = ['Management', 'Sales', 'Finance', 'Engineering', 'Procurement', 'Production', 'Warehouse', 'Quality', 'Projects', 'Maintenance', 'Administration'];

export interface Person {
  id: string;
  name: string;
  title: string;
  dept: string;
  site: string;
  email: string;
  status: 'Active' | 'Invited';
  lastSignIn: string;
}

const person = (id: string, name: string, title: string, dept: string, site: string, status: Person['status'] = 'Active', lastSignIn = '2026-11-13'): Person => ({
  id,
  name,
  title,
  dept,
  site,
  email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
  status,
  lastSignIn,
});

export const PEOPLE: Person[] = [
  person('U-01', 'Alex Morgan', 'Demonstration user', 'Management', 'Brisbane'),
  person('U-02', 'Chris Doyle', 'Managing director', 'Management', 'Brisbane'),
  person('U-03', 'Jess Patel', 'Operations director', 'Management', 'Sydney'),
  person('U-04', 'Priya Nair', 'Sales manager', 'Sales', 'Sydney'),
  person('U-05', 'Daniel Okafor', 'Finance manager', 'Finance', 'Brisbane'),
  person('U-06', 'Mei Lin', 'Accountant', 'Finance', 'Brisbane'),
  person('U-07', 'Tom Walsh', 'Design engineer', 'Engineering', 'Brisbane'),
  person('U-08', 'Sara Haddad', 'Procurement manager', 'Procurement', 'Brisbane'),
  person('U-09', 'Ben Carter', 'Production manager', 'Production', 'Brisbane'),
  person('U-10', 'Luca Romano', 'Warehouse manager', 'Warehouse', 'Brisbane'),
  person('U-11', 'Grace Kim', 'Quality manager', 'Quality', 'Brisbane'),
  person('U-12', 'Hannah Brooks', 'Project manager', 'Projects', 'Sydney'),
  person('U-13', 'Omar Siddiqui', 'Systems administrator', 'Administration', 'Brisbane'),
  person('U-14', 'Ruby Fraser', 'Sales representative', 'Sales', 'Brisbane', 'Active', '2026-11-12'),
  person('U-15', 'Noah Becker', 'Welder', 'Production', 'Brisbane', 'Active', '2026-11-13'),
  person('U-16', 'Isla Turner', 'Storeperson', 'Warehouse', 'Sydney', 'Active', '2026-11-11'),
  person('U-17', 'Ethan Wu', 'Maintenance technician', 'Maintenance', 'Brisbane', 'Active', '2026-11-12'),
  person('U-18', 'Zoe Martin', 'Drafter', 'Engineering', 'Sydney', 'Active', '2026-11-10'),
  person('U-19', 'Liam Kelly', 'Production planner', 'Production', 'Brisbane', 'Active', '2026-11-13'),
  person('U-20', 'Ava Singh', 'Quality inspector', 'Quality', 'Sydney', 'Invited', ''),
  person('U-21', 'Jack Nguyen', 'Buyer', 'Procurement', 'Sydney', 'Invited', ''),
];

export const CUSTOMERS = [
  ['CUS-001', 'Harbour Builders', 'Construction', 'Sydney', 'Priya Nair'],
  ['CUS-002', 'Ridgeway Constructions', 'Construction', 'Brisbane', 'Ruby Fraser'],
  ['CUS-003', 'Northgate Mining Services', 'Mining', 'Brisbane', 'Priya Nair'],
  ['CUS-004', 'Bayside Fabrication', 'Manufacturing', 'Brisbane', 'Ruby Fraser'],
  ['CUS-005', 'Summit Rail Maintenance', 'Rail', 'Sydney', 'Priya Nair'],
  ['CUS-006', 'Coral Coast Developments', 'Construction', 'Brisbane', 'Ruby Fraser'],
  ['CUS-007', 'Greenfield Water Utilities', 'Utilities', 'Sydney', 'Priya Nair'],
  ['CUS-008', 'Westbridge Logistics', 'Logistics', 'Sydney', 'Ruby Fraser'],
  ['CUS-009', 'Pinnacle Plant Hire', 'Equipment hire', 'Brisbane', 'Priya Nair'],
  ['CUS-010', 'Kestrel Marine Services', 'Marine', 'Brisbane', 'Ruby Fraser'],
  ['CUS-011', 'Ironbark Civil', 'Construction', 'Sydney', 'Priya Nair'],
  ['CUS-012', 'Lakeside Food Processing', 'Food', 'Brisbane', 'Ruby Fraser'],
] as const;

export const SUPPLIERS = [
  ['SUP-01', 'Coastline Steel Supply', 'Steel and plate', 'Brisbane'],
  ['SUP-02', 'Metro Fasteners', 'Fasteners', 'Brisbane'],
  ['SUP-03', 'Pacific Hydraulics', 'Hydraulics', 'Sydney'],
  ['SUP-04', 'Southern Cross Electrical Wholesale', 'Electrical', 'Sydney'],
  ['SUP-05', 'Apex Coatings', 'Coatings', 'Brisbane'],
  ['SUP-06', 'Summit Bearings', 'Bearings and drives', 'Brisbane'],
  ['SUP-07', 'Delta Industrial Gases', 'Gases and consumables', 'Brisbane'],
  ['SUP-08', 'Outback Timber & Pallets', 'Packaging', 'Brisbane'],
  ['SUP-09', 'Precision Laser Cutting', 'Subcontract cutting', 'Sydney'],
  ['SUP-10', 'Riverside Gearboxes', 'Bearings and drives', 'Sydney'],
] as const;

/** Finished goods, sub-assemblies, raw materials and purchased parts. */
export const ITEMS = [
  ['PRD-1001', 'Conveyor drive frame 1200', 'Finished good', 'each', 'C', 4850],
  ['PRD-1002', 'Hopper chute assembly', 'Finished good', 'each', 'B', 3120],
  ['PRD-1003', 'Guard panel kit', 'Finished good', 'kit', 'A', 640],
  ['PRD-1004', 'Gearbox mount bracket', 'Sub-assembly', 'each', 'B', 285],
  ['PRD-1005', 'Idler roller set', 'Finished good', 'set', 'D', 410],
  ['PRD-1006', 'Walkway platform 3 m', 'Finished good', 'each', 'A', 2280],
  ['PRD-1007', 'Control cabinet base', 'Finished good', 'each', 'A', 960],
  ['PRD-1008', 'Belt tensioner unit', 'Sub-assembly', 'each', 'C', 720],
  ['PRD-1009', 'Discharge spout', 'Finished good', 'each', 'A', 1340],
  ['PRD-1010', 'Stair stringer pair', 'Finished good', 'pair', 'B', 1580],
  ['SA-3001', 'Frame weldment 1200', 'Sub-assembly', 'each', 'C', 1960],
  ['RM-2001', 'Steel plate 10 mm 2400 x 1200', 'Raw material', 'sheet', '-', 486],
  ['RM-2002', 'RHS 100 x 50 x 4 mm, 8 m', 'Raw material', 'length', '-', 214],
  ['RM-2003', 'Hex bolt M16 x 60, grade 8.8', 'Purchased part', 'each', '-', 1.85],
  ['RM-2004', 'Enamel paint, safety yellow', 'Raw material', 'litre', '-', 32],
  ['RM-2005', 'Two-pack epoxy coating', 'Raw material', 'litre', '-', 58],
  ['RM-2006', 'Flange bearing 50 mm', 'Purchased part', 'each', '-', 96],
  ['RM-2007', 'Welding wire ER70S-6, 15 kg', 'Raw material', 'spool', '-', 118],
  ['RM-2008', 'Gearbox 7.5 kW helical', 'Purchased part', 'each', '-', 2240],
  ['RM-2009', 'Hex bolt M16 x 50, grade 8.8', 'Purchased part', 'each', '-', 1.6],
] as const;

export const itemName = (id: string) => ITEMS.find((i) => i[0] === id)?.[1] ?? id;
export const itemCost = (id: string) => Number(ITEMS.find((i) => i[0] === id)?.[5] ?? 0);
export const customerName = (id: string) => CUSTOMERS.find((c) => c[0] === id)?.[1] ?? id;
export const supplierName = (id: string) => SUPPLIERS.find((s) => s[0] === id)?.[1] ?? id;
export const customerIdByName = (name: string) => CUSTOMERS.find((c) => c[1] === name)?.[0];
export const supplierIdByName = (name: string) => SUPPLIERS.find((s) => s[1] === name)?.[0];
