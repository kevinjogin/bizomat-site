# The supplier portal

Batch 2, item 5 (owner's request of 20 Nov 2026). Catalogue module 41. **Built behind the flag `supplier_portal`, which
ships off**: nothing of it answers until a platform admin switches it on in the Admin Control Centre (for everyone, a
rollout stage or one company). Code: `apps/work/src/worker/erp/supplier-portal.ts`; screens
`apps/work/src/client/system/erp/SupplierPortal.tsx`; migration `0041_erp_batch2.sql`; tests
`apps/work/test/supplier-portal.test.ts`.

## Sign-in for a supplier's own people

The portal needed sign-in for people outside the company. It uses BIZOMAT accounts, the same sign-in as everyone (and
two-factor sign-in when that is on), and never company membership:

- A buyer (or procurement manager, or ERP administrator) invites one of the supplier's people by email from the supplier's
  page, Supplier portal. The invitation is a link that works once, for 14 days; only its SHA-256 is kept. Where the
  company's email is set up it is sent; otherwise the buyer sends the link.
- The person signs in, or creates an account, **with the invited address**, and accepts. An account with another
  address cannot accept it.
- They are not members of the company and have no ERP role: the ERP's company pages stay closed to them. The portal
  answers browser sessions only (never API tokens), and every statement is scoped by company and supplier.
- Ending a person's access (the supplier's page) closes the portal to them at once. Archiving or blocking the supplier,
  or switching the flag off, closes it too.

## What they see and do (`/erp/supplier-portal`)

- **Purchase orders** of that supplier once sent to it (and later received, closed or cancelled): lines, prices, dates,
  delivery address, payment terms, terms and the notes for the supplier, as the order's PDF shows them. An approved
  order not yet sent stays the company's.
- **Answering an order**: accepted with the promised delivery date, or declined with the reason, once per revision (an
  amended order is answered again). The buyer who made and sent the order is told, and the order's page shows the
  answer.
- **Requests for quotation** the supplier is on, once sent: the lines, and their own quotation, sent or changed while the
  request is open (`erp_quotations.source = 'portal'`). Never another supplier's quotation or who was chosen.
- **Documents**: PDF or pictures added to an order (delivery dockets, certificates, invoices), with the same checks as
  every upload. The portal shows the supplier's own documents, never the company's attachments; the buyer sees them
  with the order's files.

Everything is in the company's history (`erp_events`) and the audit log.

## Not done

- Supplier invoices are not entered through the portal (they reach Finance as bills from receipts, as before).
- Catalogues, price updates and the supplier's own details (bank account, certificates register) are not self-service.
- Documents uploaded through the portal are not scanned for malware (the scanning of verification documents is a
  separate service behind its own flag); only PDF and image types are accepted.
