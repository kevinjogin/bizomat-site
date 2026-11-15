// BIZOMAT ERP, Releases 1 to 3 (Products and Engineering, Procurement, Inventory, Manufacturing): the shapes the API returns (src/worker/erp), the fixed
// lists with their plain-language labels, and the data hooks. The server decides what each person may see and do; the
// screens only show it.
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { formatMoney } from '../../../shared/crm/money';

export type ErpRole = 'erp_admin' | 'executive' | 'engineer' | 'engineering_approver' | 'buyer' | 'procurement_manager' | 'warehouse_manager' | 'warehouse_operator' | 'production_manager' | 'production_operator' | 'viewer';
export type Capability =
  | 'products.view'
  | 'products.edit'
  | 'changes.raise'
  | 'changes.review'
  | 'changes.approve'
  | 'documents.edit'
  | 'documents.approve'
  | 'suppliers.view'
  | 'suppliers.edit'
  | 'suppliers.approve'
  | 'product_suppliers.edit'
  | 'reports.view'
  | 'roles.manage'
  | 'purchasing.view'
  | 'requisitions.raise'
  | 'requisitions.approve'
  | 'purchasing.edit'
  | 'purchasing.approve'
  | 'receiving.post'
  | 'inventory.view'
  | 'inventory.operate'
  | 'inventory.approve'
  | 'inventory.setup'
  | 'settings.manage'
  | 'manufacturing.view'
  | 'manufacturing.setup'
  | 'routings.release'
  | 'production.plan'
  | 'production.execute'
  | 'production.issue'
  | 'production.receive'
  | 'mrp.run'
  | 'mrp.buy';

export interface ErpMe {
  company: { id: string; name: string; kind: 'registered' | 'own' | 'demo' };
  user: { id: string; name: string };
  companyRole: 'owner' | 'admin' | 'member';
  roles: ErpRole[];
  roleLabels: string[];
  solo: boolean;
  can: Record<Capability, boolean>;
}

export const PRODUCT_TYPES = {
  raw_material: 'Raw material',
  component: 'Component',
  manufactured_part: 'Manufactured part',
  assembly: 'Assembly',
  subassembly: 'Subassembly',
  finished_product: 'Finished product',
  purchased_item: 'Purchased item',
  consumable: 'Consumable',
  service: 'Service',
} as const;
export type ProductType = keyof typeof PRODUCT_TYPES;
export const LIFECYCLE = { draft: 'Draft', active: 'Active', phased_out: 'Phased out', obsolete: 'Obsolete' } as const;
export const REVISION_STATUS = { draft: 'Draft', in_change: 'In a change order', released: 'Released', superseded: 'Superseded' } as const;
export const ECR_STATUS = { submitted: 'Submitted', under_review: 'Under review', approved: 'Approved', rejected: 'Rejected' } as const;
export const ECO_STATUS = { draft: 'Draft', submitted: 'Submitted', approved: 'Approved', released: 'Released', cancelled: 'Cancelled' } as const;
export const DOC_KINDS = { drawing: 'Drawing', model: '3D model', pdf: 'PDF', dxf: 'DXF', step: 'STEP', specification: 'Specification', image: 'Image', other: 'Other' } as const;
export const DOC_STATUS = { draft: 'Draft', approved: 'Approved', obsolete: 'Obsolete' } as const;
export const SUPPLIER_STATUS = { pending: 'Pending approval', approved: 'Approved', on_hold: 'On hold', blocked: 'Blocked' } as const;
export const VARIANT_KEYS = { size: 'Size', model: 'Model', configuration: 'Configuration', material: 'Material', finish: 'Finish', options: 'Options' } as const;
export const ROLE_LABELS: Record<ErpRole, string> = {
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
  viewer: 'Viewer',
};

// ------------------------------------------------------------------ Release 2: purchasing and inventory

export const REQ_STATUS = { draft: 'Draft', submitted: 'Submitted', approved: 'Approved', rejected: 'Rejected', converted: 'Converted', cancelled: 'Cancelled' } as const;
export const RFQ_STATUS = { draft: 'Draft', sent: 'Sent', awarded: 'Supplier selected', approved: 'Selection approved', ordered: 'Ordered', cancelled: 'Cancelled' } as const;
export const PO_STATUS = { draft: 'Draft', awaiting_approval: 'Awaiting approval', approved: 'Approved', sent: 'Sent', partially_received: 'Partly received', received: 'Received', cancelled: 'Cancelled', closed: 'Closed' } as const;
export const LOCATION_KINDS = { normal: 'Normal', quarantine: 'Quarantine', work_in_progress: 'Work in progress', finished_goods: 'Finished goods', receiving: 'Receiving', dispatch: 'Dispatch' } as const;
export const LOCATION_LEVELS = { store: 'Store', zone: 'Zone', rack: 'Rack', shelf: 'Shelf', bin: 'Bin' } as const;
export const COUNT_STATUS = { open: 'Open', submitted: 'Submitted', posted: 'Posted', cancelled: 'Cancelled' } as const;
export const ADJ_STATUS = { pending: 'Waiting for approval', posted: 'Posted', rejected: 'Rejected' } as const;

export interface RecordFile extends ErpFile {
  uploadedBy?: string | null;
}

export interface Line {
  id: string;
  position: number;
  productId: string | null;
  productNumber: string | null;
  item: string;
  specification: string;
  quantity: number;
  uom: string;
  estUnitCostCents?: number | null;
}

export interface Requisition {
  id: string;
  number: string;
  title: string;
  requesterId: string | null;
  requesterName: string | null;
  departmentId: string | null;
  departmentName: string | null;
  requiredDate: string | null;
  budgetRef: string;
  reason: string;
  status: keyof typeof REQ_STATUS;
  statusLabel: string;
  estimatedTotalCents: number;
  currency: string;
  decidedByName: string | null;
  decidedAt: number | null;
  decisionNote: string;
  sodException: boolean;
  lineCount?: number;
  createdAt: number;
}

export interface Rfq {
  id: string;
  number: string;
  title: string;
  requisitionId: string | null;
  requisitionNumber: string | null;
  requiredDate: string | null;
  replyBy: string | null;
  currency: string;
  deliveryAddress: string;
  notes: string;
  status: keyof typeof RFQ_STATUS;
  statusLabel: string;
  selectedQuotationId: string | null;
  selectionReason: string;
  selectedByName: string | null;
  approvedByName: string | null;
  approvedAt: number | null;
  sodException: boolean;
  supplierCount?: number;
  quotationCount?: number;
  createdByName: string | null;
  createdAt: number;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  revision: number;
  supplierId: string;
  supplierNumber: string;
  supplierName: string;
  status: keyof typeof PO_STATUS;
  statusLabel: string;
  requisitionId: string | null;
  requisitionNumber: string | null;
  rfqId: string | null;
  rfqNumber: string | null;
  orderDate: string;
  requiredDate: string | null;
  deliveryAddress: string;
  paymentTermsDays: number | null;
  currency: string;
  taxMode: 'exclusive' | 'inclusive' | 'none';
  notes: string;
  terms: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  approvalRule: string | null;
  approvalRuleLabel: string | null;
  approvalLimitCents: number | null;
  submittedByName: string | null;
  approvedByName: string | null;
  approvedAt: number | null;
  sodException: boolean;
  sentAt: number | null;
  cancelReason: string;
  createdByName: string | null;
  createdAt: number;
}

export interface PoLine {
  id: string;
  position: number;
  productId: string | null;
  productNumber: string | null;
  item: string;
  specification: string;
  quantity: number;
  uom: string;
  unitPriceCents: number;
  discountBp: number;
  taxCode: string;
  taxRateBp: number;
  netCents: number;
  taxCents: number;
  received: number;
  rejected: number;
  outstanding: number;
  requiredDate: string | null;
}

export interface Receipt {
  id: string;
  number: string;
  poId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  receivedDate: string;
  deliveryRef: string;
  notes: string;
  onTime: boolean | null;
  inspectionRequired: boolean;
  byName: string | null;
  createdAt: number;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  archived: boolean;
  locations: number;
  onHand: number;
}

export interface Location {
  id: string;
  warehouseId: string;
  warehouseCode: string | null;
  parentId: string | null;
  code: string;
  fullCode: string;
  name: string;
  level: keyof typeof LOCATION_LEVELS;
  levelLabel: string;
  kind: keyof typeof LOCATION_KINDS;
  kindLabel: string;
  archived: boolean;
  onHand?: number;
}

export interface StockRow {
  id: string;
  productId: string;
  productNumber?: string;
  productName?: string;
  locationId: string;
  locationCode: string;
  locationKind: string;
  locationKindLabel: string;
  warehouseCode: string;
  lot: string;
  serial: string;
  expiry: string | null;
  onHand: number;
  reserved: number;
  available: number;
}

export interface Move {
  id: string;
  groupId: string;
  type: string;
  typeLabel: string;
  productId: string;
  productNumber: string;
  productName: string;
  locationId: string;
  locationCode: string;
  warehouseCode: string;
  lot: string;
  serial: string;
  quantity: number;
  reserved: number;
  unitCostCents: number | null;
  valueCents: number;
  sourceType: string;
  sourceId: string | null;
  reference: string;
  reason: string;
  byName: string | null;
  at: number;
}

export interface ErpSettings {
  poApprovalLimitCents: number | null;
  adjustmentApprovalCents: number | null;
  allowNegativeStock: boolean;
  costingMethod: 'weighted_average' | 'fifo' | null;
  costingLocked: boolean;
  costingLabel: string;
  currency: string;
}

export interface ErpEvent {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  actorId: string | null;
  actorName: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  at: number;
}

export interface ErpFile {
  id: string;
  name: string;
  mime: string;
  size: number;
  isImage: boolean;
  uploadedBy?: string | null;
  uploadedByName: string | null;
  createdAt: number;
  url: string;
}

export interface Product {
  id: string;
  number: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  family: string;
  type: ProductType;
  typeLabel: string;
  uom: string;
  manufacturer: string;
  standardCostCents: number | null;
  currentCostCents: number | null;
  priceCents: number | null;
  currency: string;
  weight: number | null;
  weightUnit: string;
  length: number | null;
  width: number | null;
  height: number | null;
  dimensionUnit: string;
  material: string;
  properties: { key: string; value: string }[];
  lifecycle: keyof typeof LIFECYCLE;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  variantOf: string | null;
  variantOfNumber: string | null;
  variantOfName: string | null;
  variantAttributes: Record<string, string>;
  releasedRevision: string | null;
  releasedRevisionId: string | null;
  archived: boolean;
  createdByName: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Revision {
  id: string;
  productId: string;
  label: string;
  status: keyof typeof REVISION_STATUS;
  description: string;
  changeReason: string;
  effectiveDate: string | null;
  ecoId: string | null;
  ecoNumber: string | null;
  ecoStatus: keyof typeof ECO_STATUS | null;
  releasedAt: number | null;
  releasedByName: string | null;
  supersededAt: number | null;
  supersededBy: string | null;
  lines?: number;
  createdAt: number;
  updatedAt: number;
}

export interface BomLine {
  id: string;
  revisionId: string;
  componentId: string;
  componentNumber: string;
  componentName: string;
  componentType: ProductType;
  componentTypeLabel: string;
  componentUom: string;
  componentReleased: string | null;
  componentReleasedId: string | null;
  hasStructure: boolean;
  quantity: number;
  uom: string;
  scrapPct: number;
  refDesignator: string;
  position: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  optional: boolean;
  altGroup: string;
  notes: string;
}

export interface ProductSupplier {
  productId: string;
  supplierId: string;
  supplierNumber: string | null;
  supplierName: string | null;
  supplierStatus: keyof typeof SUPPLIER_STATUS | null;
  supplierPartNumber: string;
  priceCents: number | null;
  currency: string;
  leadTimeDays: number | null;
  moq: number | null;
  preferred: boolean;
  notes: string;
}

export interface EngDocument {
  id: string;
  number: string;
  title: string;
  kind: keyof typeof DOC_KINDS;
  kindLabel: string;
  status: keyof typeof DOC_STATUS;
  statusLabel: string;
  productId: string;
  productNumber: string | null;
  productName: string | null;
  revisionId: string | null;
  revisionLabel: string | null;
  approvedByName: string | null;
  approvedAt: number | null;
  createdByName: string | null;
  latestVersion: number | null;
  latestDocRevision: string | null;
  latestSource: 'file' | 'cad_reference' | null;
  createdAt: number;
  updatedAt: number;
}

export interface ProductView {
  product: Product;
  variants: Product[];
  revisions: Revision[];
  suppliers: ProductSupplier[];
  files: ErpFile[];
  documents: EngDocument[];
  history: ErpEvent[];
  can: { edit: boolean; raiseChange: boolean; approve: boolean; editDocuments: boolean; editSuppliers: boolean; viewSuppliers: boolean };
}

export interface ChangeRequest {
  id: string;
  number: string;
  title: string;
  description: string;
  reason: string;
  status: keyof typeof ECR_STATUS;
  statusLabel: string;
  requestedByName: string | null;
  decidedByName: string | null;
  decidedAt: number | null;
  decisionNote: string;
  productCount?: number;
  createdAt: number;
}

export interface ChangeOrder {
  id: string;
  number: string;
  title: string;
  description: string;
  reason: string;
  status: keyof typeof ECO_STATUS;
  statusLabel: string;
  requestId: string | null;
  requestNumber: string | null;
  createdBy: string | null;
  createdByName: string | null;
  submittedAt: number | null;
  approvedAt: number | null;
  approvedByName: string | null;
  releasedAt: number | null;
  releasedByName: string | null;
  cancelledAt: number | null;
  decisionNote: string;
  sodException: boolean;
  revisionCount?: number;
  createdAt: number;
}

export interface Supplier {
  id: string;
  number: string;
  legalName: string;
  tradingName: string;
  name: string;
  abn: string;
  abnCheck: 'format_checked' | 'none';
  category: string;
  email: string;
  phone: string;
  website: string;
  postalAddress: string;
  deliveryAddress: string;
  paymentTermsDays: number | null;
  currency: string;
  deliveryTerms: string;
  leadTimeDays: number | null;
  status: keyof typeof SUPPLIER_STATUS;
  statusLabel: string;
  statusNote: string;
  approvedByName: string | null;
  approvedAt: number | null;
  sodException: boolean;
  financeLinked: boolean;
  notes: string;
  productCount?: number;
  createdByName: string | null;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
}

export const erpPath = (companyId: string, path = '') => `/erp/c/${encodeURIComponent(companyId)}${path}`;
/** The address of an ERP page inside the ERP (router paths, under /erp). */
export const productsPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/products${path}`;
export const procurementPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/procurement${path}`;
export const inventoryPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/inventory${path}`;
export const manufacturingPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/manufacturing${path}`;
/** A file or picture served by the API (QR labels, PDFs), at its address under the app. */
export const apiHref = (companyId: string, path: string) => appUrl(`/api${erpPath(companyId, path)}`);
export const reportPage = (companyId: string, key = '') => `/c/${encodeURIComponent(companyId)}/erp-reports${key ? `/${key}` : ''}`;
/** A CSV download of a list or report (the same address with format=csv). */
export const csvHref = (companyId: string, path: string) => appUrl(`/api${erpPath(companyId, path)}${path.includes('?') ? '&' : '?'}format=csv`);

export const useErpMe = (companyId: string) => useQuery({ queryKey: ['erp', companyId, 'me'], queryFn: () => get<ErpMe>(erpPath(companyId, '/me')), retry: false, enabled: !!companyId });

export const money = (cents: number | null | undefined, currency = 'AUD') => (cents === null || cents === undefined ? '' : formatMoney(cents, currency));

/** "12.50" -> 1250; '' -> null; anything else 'bad'. */
export function toCents(v: string): number | null | 'bad' {
  const s = v.trim().replace(/[$,\s]/g, '');
  if (!s) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return 'bad';
  return Math.round(Number(s) * 100);
}
export const dollars = (cents: number | null | undefined) => (cents === null || cents === undefined ? '' : (cents / 100).toFixed(2));

/** A number field: '' -> null, else the number (NaN for nonsense, refused by the server). */
export const numOrNull = (v: string) => (v.trim() === '' ? null : Number(v));

export function dateText(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
export const dayText = (t: number | null | undefined) => (t ? new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const qty = (n: number) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 1e6) / 1e6));

// ------------------------------------------------------------------ Release 3: manufacturing

export const MO_STATUS = { draft: 'Draft', released: 'Released', in_progress: 'In progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled' } as const;
export const OP_STATUS = { pending: 'Not started', in_progress: 'In progress', paused: 'Paused', completed: 'Completed' } as const;
export const WC_STATUS = { active: 'Active', on_hold: 'On hold', inactive: 'Inactive' } as const;
export const ROUTING_STATUS = { draft: 'Draft', released: 'Released', superseded: 'Superseded' } as const;
export const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface WorkCentre {
  id: string;
  code: string;
  name: string;
  description: string;
  status: keyof typeof WC_STATUS;
  statusLabel: string;
  workingDays: number[];
  workingDaysText: string;
  hoursPerDay: number;
  efficiencyPct: number;
  machines: number;
  labourRateCents: number;
  machineRateCents: number;
  overheadRateCents: number;
  overheadPct: number;
  dailyHours: number;
  weeklyHours: number;
  machineCount?: number;
  openOperations?: number;
  archived: boolean;
}

export interface Machine {
  id: string;
  workCentreId: string;
  workCentreCode: string | null;
  code: string;
  name: string;
  status: 'active' | 'inactive';
  machineRateCents: number | null;
  assetId: string | null;
  asset: { id: string; number: string; name: string; status: string } | null;
  down: boolean;
  breakdown: { id: string; number: string; description: string } | null;
  notes: string;
  archived: boolean;
}

export interface Routing {
  id: string;
  productId: string;
  productNumber: string | null;
  productName: string | null;
  revision: string;
  status: keyof typeof ROUTING_STATUS;
  statusLabel: string;
  description: string;
  leadTimeDays: number | null;
  releasedByName: string | null;
  releasedAt: number | null;
  releaseNote: string;
  sodException: boolean;
  createdByName: string | null;
  operationCount?: number;
  createdAt: number;
}

export interface Operation {
  id: string;
  opNo: number;
  name: string;
  instructions: string;
  workCentreId: string | null;
  workCentreCode: string | null;
  workCentreName: string | null;
  machineId: string | null;
  machineCode: string | null;
  setupMinutes: number;
  runMinutes: number;
  crew: number;
  inspection: boolean;
  inspectionNote: string;
  outsourced: boolean;
  supplierId: string | null;
  supplierName: string | null;
  outsourceCostCents: number | null;
  outsourceDays: number | null;
  predecessors: number[] | null;
  effectivePredecessors: number[];
  overlap: boolean;
}

export interface MoOperation extends Operation {
  status: keyof typeof OP_STATUS;
  statusLabel: string;
  maxQty: number;
  goodQty: number;
  scrapQty: number;
  reworkQty: number;
  downtimeMinutes: number;
  unitsIn: number;
  plannedStart: string | null;
  plannedFinish: string | null;
  startedAt: number | null;
  completedAt: number | null;
  inspectionResult: 'pass' | 'fail' | null;
  inspectionComment: string;
  actualOutsourceCents: number | null;
  ready: boolean | null;
  machineDown: boolean;
  breakdown: { id: string; number: string; description: string } | null;
}

export type CostElement = 'materials' | 'labour' | 'machine' | 'outsourcing' | 'overheads' | 'scrap' | 'rework';

export interface ManufacturingOrder {
  id: string;
  number: string;
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  bomRevisionId: string;
  bomRevision: string;
  routingId: string | null;
  routingRevision: string | null;
  quantity: number;
  maxQty: number;
  completedQty: number;
  receivedValueCents: number;
  startDate: string | null;
  requiredDate: string | null;
  finishDate: string | null;
  method: string;
  methodLabel: string;
  productionType: string;
  productionTypeLabel: string;
  priority: string;
  priorityLabel: string;
  customerRef: string;
  fgLocationId: string | null;
  fgLocationCode: string | null;
  notes: string;
  status: keyof typeof MO_STATUS;
  statusLabel: string;
  revision: number;
  currency: string;
  estimate: Record<CostElement, number> & { total: number };
  estimateMissing: string[];
  actualCents: number | null;
  varianceCents: number | null;
  late: boolean;
  overdue: boolean;
  operations?: { total: number; done: number };
  progressPct: number;
  mrpSuggestionId: string | null;
  createdByName: string | null;
  releasedByName: string | null;
  releasedAt: number | null;
  completedAt: number | null;
  closedAt: number | null;
  cancelledAt: number | null;
  cancelReason: string;
  createdAt: number;
}

export interface CostView {
  currency: string;
  final: boolean;
  elements: { element: CostElement; label: string; estimatedCents: number; actualCents: number; varianceCents: number }[];
  estimatedCents: number;
  actualCents: number;
  varianceCents: number;
  estimatedUnitCents: number | null;
  actualUnitCents: number | null;
  receivedValueCents: number;
  unabsorbedCents: number;
  missing: string[];
  profitability: string;
  note: string;
}

export interface Suggestion {
  id: string;
  runId: string;
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  kind: 'buy' | 'make' | 'expedite';
  kindLabel: string;
  quantity: number;
  needDate: string | null;
  orderDate: string | null;
  leadTimeDays: number;
  supplierName: string | null;
  refType: string;
  refId: string | null;
  refNumber: string;
  messages: string[];
  reason: string;
  status: 'open' | 'converted' | 'dismissed';
  convertedType: string;
  convertedId: string | null;
  convertedNumber: string;
}

export const MESSAGE_LABELS: Record<string, string> = { late: 'Late', overdue: 'Overdue', expedite: 'Expedite' };
