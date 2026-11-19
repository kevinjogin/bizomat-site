// A statement the company scope check must find (test-node/company-queries.test.ts). Never imported.
export const scoped = 'SELECT * FROM erp_products WHERE company_id = ? AND id = ?';
export const unscoped = 'SELECT * FROM erp_products WHERE id = ?';
