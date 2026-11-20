// Writes docs/erp/MODULES.md, the master tracking table of BIZOMAT ERP's 97 modules, from the one catalogue
// (apps/work/src/shared/erp-catalogue.ts) and the modules framework's definitions. The app's imports have no file
// extensions, so it runs with tsx:
//   npx tsx scripts/erp/modules-doc.ts
// apps/work/test-node/erp-modules-doc.test.ts fails when the file is out of step.
import { writeFileSync } from 'node:fs';
import { modulesMarkdown } from '../../apps/work/src/shared/erp-catalogue-doc';

writeFileSync(new URL('../../docs/erp/MODULES.md', import.meta.url), modulesMarkdown());
console.log('docs/erp/MODULES.md written');
